import {createSearch,validateCatalog,inferAreas} from './search-core.mjs';
import {loadCatalog} from './catalog-loader.mjs';
let engine,currentMeta;
globalThis.onmessage=async({data})=>{
  const {id,action}=data;
  try {
    if(action==='init'||action==='refresh') {
      const {catalog,channel}=await loadCatalog({refresh:action==='refresh',currentMeta});
      catalog.meta.deliveryChannel=channel;
      for(const record of catalog.records)record.areas=inferAreas(record);
      const nextEngine=createSearch(catalog.records);
      engine=nextEngine;currentMeta=catalog.meta;postMessage({id,action:'init',refreshed:action==='refresh',meta:catalog.meta,facets:engine.facets});
    }else {
      if(!engine)throw new Error('Catalog has not loaded');
      if(action==='search')postMessage({id,action,result:engine.search(data.options)});
      else if(action==='suggest')postMessage({id,action,result:engine.suggest(data.query,data.filters)});
    }
  }catch {postMessage({id,action,error:'The catalog could not be loaded or searched. Reload the page; if this continues, ask the owner to verify the catalog import.'});}
};
