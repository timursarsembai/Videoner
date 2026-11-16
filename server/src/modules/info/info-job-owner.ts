import { Request } from 'express';

export function infoJobOwner(req: Request): string {
  const visitor = req.header('x-info-visitor');
  const suffix = visitor && /^[a-f0-9]{64}$/.test(visitor) ? visitor : 'api';
  return `${(req as any).apiKey.id}:${suffix}`;
}
