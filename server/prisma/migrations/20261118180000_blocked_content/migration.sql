-- Отказ по теме (эзотерика), lib/blocked-content.ts.
ALTER TYPE "ErrorCategory" ADD VALUE IF NOT EXISTS 'BLOCKED_CONTENT';
