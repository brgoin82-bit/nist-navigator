import {validateCatalog} from './search-core.mjs';
export const PUBLISHED_CATALOG='https://raw.githubusercontent.com/brgoin82-bit/nist-navigator/main/dist/catalog.json';
export async function readCatalog(url,fetcher=fetch){
  const response=await fetcher(url,{cache:'no-store',redirect:'error',credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(45000)});
  if(!response.ok||!response.body)throw new Error('Catalog download unavailable');
  let bytes=0;const chunks=[];
  for await(const chunk of response.body){bytes+=chunk.length;if(bytes>40000000){await response.body.cancel().catch(()=>{});throw new Error('Catalog is too large');}chunks.push(chunk);}
  const all=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){all.set(chunk,offset);offset+=chunk.length;}
  const catalog=validateCatalog(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(all)));
  if(!/^[a-f0-9]{64}$/.test(catalog.meta.sha256||'')||!Number.isFinite(Date.parse(catalog.meta.releaseDate))||!Number.isFinite(Date.parse(catalog.meta.importedAt))||typeof catalog.meta.release!=='string'||catalog.meta.release.length>80||!/^https:\/\/github\.com\/usnistgov\/NIST-Tech-Pubs\/releases\/tag\/[A-Za-z0-9_.-]+$/.test(catalog.meta.sourceUrl||'')||catalog.meta.sourceRecords!==catalog.records.length)throw new Error('Unverifiable catalog metadata');
  return catalog;
}
export async function loadCatalog({refresh=false,currentMeta,fetcher=fetch}={}){
  try{
    const catalog=await readCatalog(PUBLISHED_CATALOG,fetcher);
    if(currentMeta&&Date.parse(catalog.meta.releaseDate)<Date.parse(currentMeta.releaseDate))throw new Error('Older release rejected');
    return {catalog,channel:'monthly publication'};
  }catch(error){
    if(refresh)throw error;
    return {catalog:await readCatalog('./catalog.json',fetcher),channel:'bundled fallback snapshot'};
  }
}
