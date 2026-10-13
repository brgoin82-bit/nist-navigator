import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory=fileURLToPath(new URL('../dist/',import.meta.url));
const port=Number(process.argv[2]||5180);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid local port');
const files=new Set(['index.html','styles.css','appearance.css','app.mjs','appearance.mjs','search-core.mjs','search-worker.mjs','catalog-loader.mjs','catalog.json','update-status.json','_headers']);
export function permittedRequest(request, selectedPort) {
  if(!['GET','HEAD'].includes(request.method))return false;
  if(![`127.0.0.1:${selectedPort}`,`localhost:${selectedPort}`].includes(request.headers.host))return false;
  if(request.headers.origin && ![`http://127.0.0.1:${selectedPort}`,`http://localhost:${selectedPort}`].includes(request.headers.origin))return false;
  return true;
}
export function publicFile(raw) {
  try { const value=decodeURIComponent(raw.split('?')[0]); if(value==='/')return 'index.html'; const file=value.slice(1);return files.has(file)&&file!=='_headers'?file:null; }catch{return null;}
}
export function createServer(selectedPort=port) {
  return http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; worker-src 'self'; connect-src 'self' https://raw.githubusercontent.com; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    if(!permittedRequest(req,selectedPort)){res.writeHead(403);res.end('Request not permitted');return;}
    const file=publicFile(req.url||'/');if(!file){res.writeHead(404);res.end('Not found');return;}
    try {
      const filename=path.join(directory,file),info=await stat(filename);
      if(!info.isFile()||info.size>40000000)throw new Error('Invalid public asset');
      const body=await readFile(filename);
      const ext=path.extname(file),mime={'.html':'text/html','.css':'text/css','.mjs':'text/javascript','.json':'application/json'}[ext];
      res.writeHead(200,{'Content-Type':mime+'; charset=utf-8','Content-Length':body.length,'Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:body);
    }catch {res.writeHead(503);res.end('Catalog or application asset is unavailable. Run the documented catalog import.');}
  });
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const server=createServer();server.requestTimeout=15000;server.headersTimeout=10000;
  server.listen(port,'127.0.0.1',()=>console.log(`NIST Navigator: http://127.0.0.1:${port}/ (local only; SignalWatch untouched)`));
}
