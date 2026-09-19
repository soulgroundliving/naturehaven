// Shared by the browser-driven tests (tools/test-*-ui and friends): starts the
// Vite dev server and headless Chromium, and collects named pass/fail checks.
//
//   const { browser, base, stop } = await startHarness({ label: 'journal-ui', port: 4177, probe: '/journal-sandbox' });
//   const { check, finish } = createChecks('journal-ui');
//
// Exit codes every test built on it shares:
//   0  every check passed
//   1  a check failed (each is listed)
//   2  the harness could not run (server or browser did not start)
import { spawn } from 'node:child_process';
import path from 'node:path';
import puppeteer from 'puppeteer';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Named checks that are all reported at the end, so one failure does not hide the rest. */
export function createChecks(label) {
  const results = [];
  return {
    check: (name, ok, detail = '') => results.push({ name, ok: Boolean(ok), detail: ok ? '' : detail }),
    /** Print every result and exit 1 if any failed. */
    finish() {
      const failed = results.filter((r) => !r.ok);
      results.forEach((r) => console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `\n        ${r.detail}` : ''}`));
      if (failed.length) {
        console.error(`\n[${label}] FAIL — ${failed.length} of ${results.length} checks failed`);
        process.exit(1);
      }
      console.log(`\n[${label}] PASS — ${results.length} checks`);
    },
  };
}

/**
 * Start the dev server on `port` (waiting until `probe` answers) and a headless
 * browser. Run from the repository root. Exits with code 2 if either fails to start.
 *
 * Set TEST_BASE_URL (for example https://naturehaven-living.vercel.app) to skip the
 * dev server and drive an already-running site instead — how a deployment is checked.
 */
export async function startHarness({ label, port, probe }) {
  const root = path.resolve('.');
  const remote = process.env.TEST_BASE_URL?.replace(/\/+$/, '');
  const base = remote ?? `http://127.0.0.1:${port}`;
  const vite = remote
    ? null
    : spawn(
        process.execPath,
        [path.join(root, 'node_modules', 'vite', 'bin', 'vite.js'), '--port', String(port), '--strictPort', '--host', '127.0.0.1'],
        { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] },
      );
  let viteLog = '';
  vite?.stdout.on('data', (chunk) => (viteLog += chunk));
  vite?.stderr.on('data', (chunk) => (viteLog += chunk));

  async function waitForServer() {
    for (let i = 0; i < 60; i += 1) {
      if (vite && vite.exitCode !== null) throw new Error(`vite exited early:\n${viteLog}`);
      try {
        const res = await fetch(`${base}${probe}`);
        if (res.ok) return;
      } catch {
        /* not up yet */
      }
      await sleep(500);
    }
    throw new Error(`${base}${probe} did not answer within 30s:\n${viteLog}`);
  }

  let browser;
  try {
    await waitForServer();
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROMIUM_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (error) {
    console.error(`[${label}] could not start the harness:`, error.message);
    vite?.kill();
    process.exit(2);
  }

  return {
    browser,
    base,
    /** Close the browser and stop the dev server (if there is one). */
    stop: async () => {
      await browser.close();
      vite?.kill();
    },
  };
}
