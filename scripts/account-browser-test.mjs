import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
const server=createServer(async(req,res)=>{try { let name=new URL(req.url,'http://localhost').pathname; if(name.endsWith('/'))name+='index.html'; const data=await readFile(path.join(process.cwd(),'dist',name)); res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html');res.end(data) }catch{res.statusCode=404;res.end()}}).listen(0,'127.0.0.1')
await new Promise(r=>server.once('listening',r))
const browser=await chromium.launch({headless:true}); const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message))
const user={id:'11111111-1111-4111-8111-111111111111',aud:'authenticated',role:'authenticated',email:'test@example.test',email_confirmed_at:new Date().toISOString(),user_metadata:{display_name:'Test'},app_metadata:{provider:'email'},identities:[{provider:'email'}],created_at:new Date().toISOString()}
await page.route('https://hvevaxsfeyiikjhcsafi.supabase.co/**',async route=>{
 const url=route.request().url(); let body={}; if(url.includes('/token')) body={access_token:'test-access',refresh_token:'test-refresh',token_type:'bearer',expires_in:3600,user}; else if(url.includes('/functions/')) body={user:{displayName:'Test',bio:''},sessions:[{current:true,createdAt:new Date().toISOString()}],deletion:null}; else if(url.includes('/user'))body=user;
 await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)})
})
try {
 await page.goto(`http://127.0.0.1:${server.address().port}/account/`); await page.getByRole('heading',{name:'Sign in',exact:true}).waitFor()
 await page.getByRole('button',{name:'Create account',exact:true}).click();await page.locator('#name').waitFor();await page.getByRole('button',{name:'Back to sign in'}).click()
 await page.getByLabel('Email',{exact:true}).fill('test@example.test');await page.getByLabel('Password',{exact:true}).fill('test-password');await page.getByRole('button',{name:'Sign in',exact:true}).click()
 await page.getByRole('heading',{name:'Your account',exact:true}).waitFor();await page.getByText('Email and password',{exact:true}).waitFor();assert.equal(await page.getByText('Google',{exact:true}).count(),0)
 await page.locator('#display-name').fill('<img src=x onerror=alert(1)>');await page.getByRole('button',{name:'Save changes'}).click();await page.getByText('Profile saved.',{exact:true}).waitFor()
 await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)
 await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByRole('heading',{name:'Sign in',exact:true}).waitFor();assert.deepEqual(errors,[]);console.log('PASS browser mock: sign-up navigation, login, profile save, actual identities, mobile width, logout; no page errors')
}finally{await browser.close();server.close()}


