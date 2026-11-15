#!/usr/bin/env python3
"""Run the experimental local solver without putting proxy credentials in argv."""
import argparse
import json
import os
from pathlib import Path
import secrets
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('url')
parser.add_argument('--country', choices=['us', 'de', 'gb'], default='de')
parser.add_argument('--audio', action='store_true', help='Try optional local audio recognition first')
parser.add_argument('--models', default='/tmp/videoner-reddit-models')
parser.add_argument('--output', default='/tmp/videoner-reddit-auto-probe')
args = parser.parse_args()
source = Path(__file__).resolve().parent
proxy = os.environ.get('REDDIT_PROXY_URL')
if not proxy:
    env_file = source.parent / '.env'
    if env_file.exists():
        for line in env_file.read_text().splitlines():
            if line.startswith('REDDIT_PROXY_URL='):
                proxy = line.split('=', 1)[1].strip().strip('"').strip("'")
if not proxy:
    raise SystemExit('REDDIT_PROXY_URL is missing')
output = Path(args.output).resolve()
output.mkdir(parents=True, exist_ok=True, mode=0o700)
models = Path(args.models).resolve()
if not models.is_dir():
    raise SystemExit('Warm up models before running the probe')
name = 'videoner-reddit-probe-' + secrets.token_hex(5)
command = [
    'docker', 'run', '--rm', '-i', '--name', name,
    '--memory=1900m', '--cpus=1', '--pids-limit=200',
    '--volume', f'{source}:/lab:ro', '--volume', f'{models}:/models:ro',
    '--volume', f'{output}:/output', '--workdir', '/lab',
    '--env', 'MODEL_OFFLINE=1', '--env', 'PROBE_REPORT=/output/report.json',
    '--env', 'PROBE_SCREENSHOT=/output/final.png', '--env', 'CAPTCHA_ARTIFACT_DIR=/output/rounds',
    '--entrypoint', 'node', 'videoner-threads-resolver', 'probe.mjs',
]
try:
    result = subprocess.run(command, input=json.dumps({
        'proxy': proxy, 'url': args.url, 'country': args.country, 'audio': args.audio,
    }), text=True, timeout=240)
    raise SystemExit(result.returncode)
except subprocess.TimeoutExpired:
    subprocess.run(['docker', 'stop', '--time', '5', name], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    raise SystemExit('Probe timed out; temporary container stopped')
