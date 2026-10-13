import {readFile,writeFile} from 'node:fs/promises';
import {validateCatalog} from '../dist/search-core.mjs';
const catalog=validateCatalog(JSON.parse(await readFile(new URL('../dist/catalog.json',import.meta.url),'utf8')));
await writeFile(new URL('../dist/update-status.json',import.meta.url),JSON.stringify({schema:1,checkedAt:new Date().toISOString(),release:catalog.meta.release,sha256:catalog.meta.sha256,indexedRecords:catalog.records.length,schedule:'Monthly: day 10 at 14:17 UTC'},null,2)+'\n');
console.log('Successful catalog source check recorded.');
