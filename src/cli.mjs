#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// The entry point is TypeScript, run through node's type stripping: unflagged since 22.18 and
// 23.6, behind `--experimental-strip-types` from 22.6. Older versions cannot load it at all, and
// fail with a bare ERR_UNKNOWN_FILE_EXTENSION — `engines` does not stop them, since npx installs
// a package whose engines it does not satisfy and only warns. Hence this shim.
const [major, minor] = process.versions.node.split('.').map(Number);
const entry = fileURLToPath(new URL('./run.ts', import.meta.url));

if (major > 23 || (major === 23 && minor >= 6) || (major === 22 && minor >= 18)) {
    await import(entry);
} else if (major === 23 || (major === 22 && minor >= 6)) {
    const { status } = spawnSync(process.execPath, ['--experimental-strip-types', entry, ...process.argv.slice(2)], { stdio: 'inherit' });
    process.exit(status ?? 1);
} else {
    console.error(`api-extractor-report needs node 22.18 or newer (you are on ${process.version}).`);
    process.exit(1);
}
