import { test } from 'node:test'
import assert from 'node:assert/strict'
import { safeError, identityLabels } from '../src/account/helpers.js'
import { readFileSync } from 'node:fs'
test('auth errors never expose server messages or supplied HTML', () => {
  assert.equal(safeError({message:'<img src=x onerror=alert(1)>',code:'unknown'}), 'Unable to complete this request. Please try again.')
  assert.equal(safeError({code:'invalid_credentials'}), 'Email or password is incorrect.')
})
test('methods show only actual identities and deduplicate providers', () => {
  assert.deepEqual(identityLabels([]), [])
  assert.deepEqual(identityLabels([{provider:'email'},{provider:'email'},{provider:'github'}]), ['Email and password','GitHub'])
})
test('account uses PKCE, no raw HTML rendering and hosted bundle', () => {
  const app = readFileSync(new URL('../src/account/app.js',import.meta.url),'utf8')
  assert.match(app,/flowType: 'pkce'/); assert.doesNotMatch(app,/innerHTML|insertAdjacentHTML/)
  assert.match(app,/confirmation: 'DELETE'/); assert.match(app,/getAuthorizationDetails/)
  const html = readFileSync(new URL('../src/account/index.html',import.meta.url),'utf8')
  assert.doesNotMatch(html, /https:\/\/.*\.js/)
})

test('Google callback preserves only validated consent context on same origin', async () => {
  const { authCallback } = await import('../src/account/helpers.js')
  assert.equal(authCallback('https://codevalanche.com/account/authorize/?authorization_id=abc-123_xyz&redirect_to=https://evil.test&code=secret&flow=recovery').href, 'https://codevalanche.com/account/?authorization_id=abc-123_xyz')
  for (const id of ['https://evil.test','../bad','<script>', 'x'.repeat(201)]) {
    assert.equal(authCallback('https://codevalanche.com/account/?authorization_id='+encodeURIComponent(id)).href, 'https://codevalanche.com/account/')
  }
})
