import { mkdir, open, readFile, copyFile, rename, unlink } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createCatalogParser } from '../lib/catalog.mjs';
import { inferAreas } from '../dist/search-core.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root,'dist/catalog.json');
const runtime = path.join(root,'.runtime');
await mkdir(runtime,{recursive:true});
let lock;
try { lock = await open(path.join(runtime,'sync.lock'),'wx'); }
catch { throw new Error('A catalog sync is already running, or a prior interrupted sync lock needs inspection.'); }
const allowed = url => url.protocol==='https:' && !url.username && !url.password && !url.port && ['api.github.com','github.com','release-assets.githubusercontent.com','objects.githubusercontent.com'].includes(url.hostname);
async function request(url, signal) {
  for(let redirects=0;redirects<=4;redirects++) {
    if(!allowed(new URL(url))) throw new Error('Unreviewed catalog destination');
    const response=await fetch(url,{redirect:'manual',signal,headers:{'User-Agent':'NISTNavigator/0.1 (public research catalog)','Accept':'application/vnd.github+json, application/xml;q=0.9, */*;q=0.1'}});
    if(response.status>=300 && response.status<400) {
      const location=response.headers.get('location'); await response.body?.cancel();
      if(!location)throw new Error('Missing redirect destination');
      url=new URL(location,url).href; continue;
    }
    if(!response.ok) { await response.body?.cancel(); throw new Error(`NIST metadata request returned HTTP ${response.status}; existing catalog retained`); }
    return response;
  }
  throw new Error('Too many catalog redirects');
}
let temporary;
try {
  const response = await request('https://api.github.com/repos/usnistgov/NIST-Tech-Pubs/releases/latest',AbortSignal.timeout(30000));
  let metaText=''; for await (const chunk of response.body) { metaText+=Buffer.from(chunk).toString('utf8'); if(metaText.length>1000000)throw new Error('Release metadata too large'); }
  const release=JSON.parse(metaText);
  if(!Array.isArray(release.assets)||!/^https:\/\/github\.com\/usnistgov\/NIST-Tech-Pubs\/releases\/tag\//.test(release.html_url||'')) throw new Error('Unexpected official release metadata');
  const asset=release.assets.find(x=>x.name==='allrecords-MODS.xml');
  if(!asset || !Number.isSafeInteger(asset.size)||asset.size<1000000||asset.size>110000000||!/^sha256:[a-f0-9]{64}$/.test(asset.digest||'')||!asset.browser_download_url.startsWith('https://github.com/usnistgov/NIST-Tech-Pubs/releases/download/')) throw new Error('Unverifiable NIST catalog release');
  const previous = await readFile(output,'utf8').then(JSON.parse).catch(error=>{if(error.code==='ENOENT')return null;throw error;});
  if(previous?.meta?.sha256 === asset.digest.slice(7) && !process.argv.includes('--force')) { console.log(JSON.stringify({status:'unchanged',release:release.tag_name,records:previous.records.length,importedAt:previous.meta.importedAt})); }
  else {
    const records=[];
    const ids=new Set();
    const parser=createCatalogParser(record=>{ if(ids.has(record.id)) throw new Error('Duplicate catalog record ID; refusing ambiguous import'); ids.add(record.id); record.areas=inferAreas(record); records.push(record); });
    const hash=createHash('sha256'), decoder=new TextDecoder('utf-8',{fatal:true});
    const data=await request(asset.browser_download_url,AbortSignal.timeout(180000));
    let size=0,lastProgress=0;
    for await(const bytes of data.body) {
      size+=bytes.length; if(size>asset.size || size>110000000)throw new Error('Catalog download exceeded declared size');
      hash.update(bytes); parser.write(decoder.decode(bytes,{stream:true}));
      if(size-lastProgress>20000000){console.log(`Read ${Math.round(size/1000000)} MB; ${records.length.toLocaleString()} records`);lastProgress=size;}
    }
    parser.write(decoder.decode());const parsed=parser.end();const digest=hash.digest('hex');
    if(size!==asset.size||digest!==asset.digest.slice(7)||parsed!==records.length)throw new Error('Catalog checksum, size or record completeness mismatch');
    if(records.length<1000 || (previous && records.length<previous.records.length*0.95))throw new Error('Unexpected catalog shrink; existing catalog retained for review');
    const catalog={meta:{schema:1,importedAt:new Date().toISOString(),release:release.tag_name,releaseDate:release.published_at,sourceUrl:release.html_url,sha256:digest,sourceBytes:size,sourceRecords:parsed,indexedRecords:records.length,coverage:'Entire NIST Research Library MODS export. Not all NIST-authored external journal articles or every CSRC draft. Search covers catalog metadata, not PDF full text.',subjectMethod:'Original catalog subjects plus clearly labeled rule-based area groups. Check the original publication for current version and withdrawal status.'},records};
    temporary=path.join(root,'dist/catalog.'+randomUUID()+'.tmp');
    const handle=await open(temporary,'wx');try{await handle.writeFile(JSON.stringify(catalog));await handle.sync();}finally{await handle.close();}
    const verified=JSON.parse(await readFile(temporary,'utf8'));if(verified.records.length!==parsed)throw new Error('Written catalog count mismatch');
    if(previous)await copyFile(output,path.join(runtime,'catalog.previous.json'));
    await rename(temporary,output);temporary=null;
    console.log(JSON.stringify({status:'success',...catalog.meta,output},null,2));
  }
} finally {
  if(temporary)await unlink(temporary).catch(()=>{});
  await lock.close();await unlink(path.join(runtime,'sync.lock'));
}
