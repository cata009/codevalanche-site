import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { webcrypto } from 'node:crypto'

const source = readFileSync(new URL('../src/account-funnel.js', import.meta.url), 'utf8')
function setup(origin = 'https://accounts.example.test') {
  const requests = [], storage = new Map(), listeners = {}
  const accountLink = { hidden: true }, unavailable = { hidden: false }
  const document = { cookie: '', querySelectorAll: () => [accountLink], querySelector: () => unavailable, addEventListener: (name, fn) => { listeners[name] = fn } }
  const context = { document, URL, crypto: webcrypto, location: { protocol: 'https:' }, localStorage: { getItem: k => storage.get(k), setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) }, fetch: (...args) => { requests.push(args); return Promise.resolve({ok:true}) }, window: { CODEVALANCHE_CONFIG: { apiOrigin: origin, accountOrigin: origin }, addEventListener: (name, fn) => { listeners[name] = fn } } }
  vm.runInNewContext(source, context)
  return { ...context, requests, storage, listeners, accountLink, unavailable }
}
test('no request or identifier before explicit acceptance; visit is sent once', () => {
  const c = setup()
  c.window.CodevalancheFunnel.track('download_clicked', 'windows')
  assert.equal(c.requests.length, 0); assert.equal(c.storage.size, 0)
  c.document.cookie = 'codevalanche_consent=accepted'
  c.listeners['codevalanche-consent'](); c.listeners['codevalanche-consent']()
  assert.equal(c.requests.length, 1)
  const [url, options] = c.requests[0], body = JSON.parse(options.body)
  assert.equal(url, 'https://accounts.example.test/api/codevalanche/accounts/events')
  assert.deepEqual(Object.keys(body).sort(), ['consent','eventId','eventName','installationId','platform'])
  assert.equal(body.eventName, 'website_view'); assert.equal(body.platform, 'web')
  assert.equal(options.credentials, 'omit'); assert.equal(options.referrerPolicy, 'no-referrer')
  assert.match(body.installationId, /^[0-9a-f-]{36}$/)
})
test('download platforms normalize and withdrawal deletes identifier', () => {
  const c = setup(); c.document.cookie = 'codevalanche_consent=accepted'
  c.window.CodevalancheFunnel.track('download_clicked', 'mac-arm')
  assert.equal(JSON.parse(c.requests[0][1].body).platform, 'macos')
  c.document.cookie = 'codevalanche_consent=declined'; c.listeners['codevalanche-consent']()
  c.window.CodevalancheFunnel.track('download_clicked', 'windows')
  assert.equal(c.requests.length, 1); assert.equal(c.storage.size, 0)
})
test('unconfigured, unsafe origins and unknown event names stay silent', () => {
  for (const origin of ['', 'javascript:alert(1)', 'https://a.test/path', 'http://a.test', 'https://user:password@a.test']) {
    const c = setup(origin); c.document.cookie = 'codevalanche_consent=accepted'
    c.listeners['codevalanche-consent']()
    assert.equal(c.requests.length, 0); assert.equal(c.storage.size, 0)
  }
  const c = setup(); c.document.cookie = 'codevalanche_consent=accepted'
  c.window.CodevalancheFunnel.track('email', 'web')
  assert.equal(c.requests.length, 0)
})
test('only a real marked download link produces a click event', () => {
  const c = setup(); c.document.cookie = 'codevalanche_consent=accepted'
  c.listeners.click({ target: { closest: () => null } })
  assert.equal(c.requests.length, 0)
  c.listeners.click({ target: { closest: () => ({ getAttribute: name => name === 'href' ? 'https://releases.example.test/setup.exe' : 'windows' }) } })
  assert.equal(c.requests.length, 1)
  assert.equal(JSON.parse(c.requests[0][1].body).eventName, 'download_clicked')
})
test('account link points only to configured central UI; blank config stays usable', () => {
  const active = setup()
  assert.equal(active.accountLink.href, 'https://accounts.example.test/account/')
  assert.equal(active.accountLink.hidden, false)
  assert.equal(active.unavailable.hidden, true)
  const blank = setup('')
  assert.equal(blank.accountLink.href, undefined)
  assert.equal(blank.accountLink.hidden, true)
  assert.equal(blank.unavailable.hidden, false)
})

