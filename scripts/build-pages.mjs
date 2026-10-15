import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');
if (basePath && (!/^\/[a-zA-Z0-9._/-]+$/.test(basePath) || basePath.includes('..') || basePath.includes('//'))) {
  throw new Error('NEXT_PUBLIC_BASE_PATH doit être un chemin, par exemple /finances-citoyennes.');
}
const env = { ...process.env, FINANCES_STATIC_EXPORT: '1', NEXT_PUBLIC_BASE_PATH: basePath, NEXT_TELEMETRY_DISABLED: '1' };
const build = spawnSync(process.execPath, [fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url)), 'build', '--webpack'], { cwd: root, env, stdio: 'inherit' });
if (build.error) throw build.error;
if (build.status !== 0) process.exit(build.status || 1);
const verify = spawnSync(process.execPath, [fileURLToPath(new URL('./verify-pages.mjs', import.meta.url))], { cwd: root, env, stdio: 'inherit' });
if (verify.error) throw verify.error;
process.exit(verify.status ?? 1);
