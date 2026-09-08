import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProfile, allowedOrigin, readClaims } from '../functions/codevalanche-account/validation.mjs';
test('profiles bounded and require strings',()=> {assert.deepEqual(normalizeProfile({displayName:' Alice ',bio:' Hi '}),{display_name:'Alice',bio:'Hi'}); assert.throws(()=>normalizeProfile({displayName:'x'.repeat(81)})); assert.throws(()=>normalizeProfile({bio:12}));});
test('CORS requires exact allowed origins',()=> {assert.equal(allowedOrigin('https://codevalanche.com'),true); assert.equal(allowedOrigin('https://codevalanche.com.evil.test'),false); assert.equal(allowedOrigin('null'),false); assert.equal(allowedOrigin(null),true);});
test('claims parser rejects malformed tokens',()=> {assert.throws(()=>readClaims('garbage'));});
