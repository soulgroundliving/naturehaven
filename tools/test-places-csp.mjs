import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import puppeteer from 'puppeteer';

const root=path.resolve('.');
const dist=path.join(root,'dist');
const vercel=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
const csp=vercel.headers.flatMap(x=>x.headers||[]).find(h=>h.key==='Content-Security-Policy')?.value;
if(!csp) throw new Error('CSP header missing');

const server=http.createServer((req,res)=>{
  const pathname=(req.url||'/').split('?')[0];
  const safe=pathname==='/'?'/index.html':pathname;
  const file=path.join(dist,safe.replace(/^\//,''));
  let target=file;
  if(!fs.existsSync(target)) target=path.join(dist,'index.html');
  if(!fs.existsSync(target)){res.writeHead(404);return res.end('not found');}
  const ext=path.extname(target);
  const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff'};
  res.setHeader('Content-Type',types[ext]||'application/octet-stream');
  if(ext==='.html') res.setHeader('Content-Security-Policy',csp);
  res.end(fs.readFileSync(target));
});
await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
const browser=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:'new',args:['--no-sandbox','--disable-setuid-sandbox']});
const page=await browser.newPage();
const errors=[]; const failed=[];
page.on('console',m=>{if(m.type()==='error') errors.push(m.text().slice(0,300));});
page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText||'unknown'}));
await page.goto('http://127.0.0.1:4173/places',{waitUntil:'domcontentloaded',timeout:30000});
await new Promise(r=>setTimeout(r,2500));
const state=await page.evaluate(()=>({
  text:document.body.innerText.replace(/\\s+/g,' ').trim().slice(0,800),
  cards:document.querySelectorAll('article').length,
  loading:document.body.innerText.includes('กำลังโหลดไกด์'),
  empty:document.body.innerText.includes('กำลังรวบรวมร้านเด็ด'),
  csp:document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content||null,
}));
console.log(JSON.stringify({errors,failed,state,patchedCspIncludes: csp.includes('https://the-green-haven.vercel.app')},null,2));
await browser.close(); server.close();
if(errors.length||failed.length||state.loading||state.empty||!csp.includes('https://the-green-haven.vercel.app')) process.exitCode=1;
