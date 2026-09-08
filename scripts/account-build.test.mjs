import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

test('both account entry pages version assets by their final built content', () => {
  const root = new URL('../', import.meta.url)
  execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: root })
  for (const page of ['account/index.html', 'account/authorize/index.html']) {
    const html = readFileSync(new URL(`dist/${page}`, root), 'utf8')
    for (const asset of ['account/app.js', 'account/account.css', 'config.js']) {
      const hash = createHash('sha256').update(readFileSync(new URL(`dist/${asset}`, root))).digest('hex').slice(0, 16)
      assert.ok(html.includes(`"/${asset}?v=${hash}"`), `${page}: ${asset} is content-versioned`)
      assert.ok(!html.includes(`"/${asset}"`), `${page}: no unversioned asset remains`)
    }
  }
})
