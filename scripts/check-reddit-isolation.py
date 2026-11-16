#!/usr/bin/env python3
"""Smoke-test an already built API image with no Reddit resolver or production data."""
import json
import subprocess
import sys
import time
import uuid


def docker(*args, check=True):
    return subprocess.run(['docker', *args], check=check, text=True, capture_output=True)


suffix = uuid.uuid4().hex[:10]
network = f'reddit-check-{suffix}'
database = f'{network}-db'
api = f'{network}-api'
image = sys.argv[1] if len(sys.argv) > 1 else 'videoner-reddit-api-check'
request_js = """
const method = process.argv[1];
const response = await fetch('http://127.0.0.1:3001/' + (method === 'POST' ? 'info' : ''), {
  method, headers: {'X-API-Key':'isolation-test-only', 'Content-Type':'application/json'},
  ...(method === 'POST' ? {body:JSON.stringify({url:'https://www.reddit.com/r/videos/comments/6rrwyj/'})} : {}),
  signal: AbortSignal.timeout(45000),
});
console.log(JSON.stringify({status:response.status, body:await response.text()}));
"""


def request(method):
    return json.loads(docker('exec', api, 'node', '--input-type=module', '-e', request_js, method).stdout)


try:
    docker('network', 'create', '--internal', network)
    docker('run', '-d', '--name', database, '--network', network, '--memory', '256m',
           '-e', 'POSTGRES_PASSWORD=isolation-test-only', '-e', 'POSTGRES_DB=downloader',
           'postgres:16-alpine')
    for _ in range(30):
        if docker('exec', database, 'pg_isready', '-U', 'postgres', check=False).returncode == 0:
            break
        time.sleep(1)
    else:
        raise RuntimeError('Temporary PostgreSQL did not start')
    docker('run', '-d', '--name', api, '--network', network, '--memory', '1g', '--cpus', '1',
           '--tmpfs', '/app/dist/downloads:uid=1000,gid=1000,mode=0700,size=16m',
           '-e', f'DATABASE_URL=postgresql://postgres:isolation-test-only@{database}:5432/downloader',
           '-e', 'SEED_API_KEY=isolation-test-only', '-e', 'NODE_ENV=production',
           '-e', 'PORT=3001', '-e', 'REDDIT_RESOLVER_URL=http://127.0.0.1:1', image)
    for _ in range(90):
        try:
            before = request('GET')
            if before['status'] == 200:
                break
        except (subprocess.CalledProcessError, json.JSONDecodeError):
            pass
        time.sleep(1)
    else:
        raise RuntimeError('API did not start without Reddit')
    failed = request('POST')
    assert failed['status'] == 400, failed
    assert 'Reddit server access unavailable' in failed['body'], failed
    after = request('GET')
    assert after['status'] == 200 and after['body'] == before['body'], after
    assert docker('inspect', '-f', '{{.State.Running}}', api).stdout.strip() == 'true'
    print('PASS: API starts without Reddit; Reddit returns 400; API remains available (200).')
except Exception:
    # This container has test credentials only; never inspect production containers.
    logs = docker('logs', '--tail', '60', api, check=False)
    print(logs.stdout + logs.stderr, file=sys.stderr)
    raise
finally:
    docker('rm', '-f', api, database, check=False)
    docker('network', 'rm', network, check=False)
