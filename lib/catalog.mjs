import sax from 'sax';

export function clean(value, max = 4000) {
  return String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

export function safeLink(value) {
  try {
    const url = new URL(value);
    const allowed = url.hostname === 'doi.org' || url.hostname === 'nist.gov' || url.hostname.endsWith('.nist.gov') || url.hostname === 'nist.primo.exlibrisgroup.com';
    if (!allowed || !['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port) return null;
    url.protocol = 'https:';
    return url.href;
  } catch { return null; }
}

export function seriesName(doi, raw) {
  const code = /(?:nist|nbs)\.([a-z]+)/i.exec(doi)?.[1]?.toUpperCase();
  const names = { SP:'Special Publications', FIPS:'FIPS', IR:'Interagency Reports', TN:'Technical Notes', HB:'Handbooks', NCSTAR:'NCSTAR', AMS:'Advanced Manufacturing Series', BSS:'Building Science Series', MONO:'Monographs', NSRDS:'Reference Data', DCI:'Data Collection Instruments', JRES:'Journal of Research' };
  return names[code] || clean(raw?.split(';')[0], 120) || 'Other series';
}

// Only NIST's fixed export is imported. XML is never rendered or executed.
export function createCatalogParser(consume) {
  const xml = sax.parser(true, { strictEntities:true, xmlns:false });
  const stack = [];
  let record = null, recordCount = 0, recordStart = 0;
  const local = name => name.split(':').at(-1).toLowerCase();
  xml.onerror = () => { throw new Error('Malformed catalog XML'); };
  xml.ondoctype = () => { throw new Error('XML DTDs are forbidden'); };
  xml.onopentag = node => {
    if (stack.length >= 40) throw new Error('Catalog XML nesting limit');
    const name = local(node.name);
    if (!stack.length && name !== 'modscollection') throw new Error('Expected a MODS catalog');
    stack.push({ name, attrs:node.attributes, text:'' });
    if (name === 'mods' && stack.length === 2) {
      if (++recordCount > 100000) throw new Error('Catalog record limit');
      recordStart = xml.position;
      record = { title:[], authors:[], subjects:[], notes:[], links:[], doi:'', id:'', abstract:'', year:null, rawSeries:'' };
    }
  };
  const append = text => {
    if (!record) return; // Do not retain collection-level formatting whitespace.
    if (record && xml.position - recordStart > 1000000) throw new Error('Catalog record too large');
    const frame = stack.at(-1);
    if (frame) {
      if (frame.text.length + text.length > 64000) throw new Error('Catalog field too large');
      frame.text += text;
    }
  };
  xml.ontext = append; xml.oncdata = append;
  xml.onclosetag = () => {
    const frame = stack.pop();
    if (!record) return;
    const path = stack.map(x => x.name).slice(1).join('/');
    const text = clean(frame.text, 32000);
    if (path === 'mods/titleinfo' && ['title','subtitle','partnumber','partname'].includes(frame.name) && text) record.title.push(text);
    if (path === 'mods/name' && frame.name === 'namepart' && frame.attrs.type !== 'date' && text) record.authors.push(text);
    if (path.startsWith('mods/subject') && ['topic','geographic','temporal','genre','namepart','title'].includes(frame.name) && text) record.subjects.push(text);
    if (path === 'mods' && frame.name === 'abstract') record.abstract += text;
    if (path === 'mods' && frame.name === 'note' && text) record.notes.push(text.slice(0,1000));
    if (path === 'mods' && frame.name === 'identifier' && frame.attrs.type === 'doi') record.doi = clean(text, 250);
    if (path === 'mods/recordinfo' && frame.name === 'recordidentifier') record.id = clean(text,100);
    if (path === 'mods/origininfo' && frame.name === 'dateissued' && record.year === null) {
      const year = /(?:18|19|20)\d{2}/.exec(text)?.[0];
      if (year) record.year = Number(year);
    }
    if (frame.name === 'url' && path === 'mods/location') for (const candidate of text.split(/;\s*(?=https?:\/\/)/)) { const link=safeLink(candidate); if(link)record.links.push(link); }
    if (path === 'mods/relateditem/titleinfo' && frame.name === 'title' && stack.some(x=>x.name==='relateditem' && x.attrs.type==='series')) record.rawSeries = text;
    if (frame.name === 'mods' && stack.length === 1) {
      const linkedDoi = record.links.find(link=>new URL(link).hostname==='doi.org');
      const candidateDoi = /^10\.6028\/[a-z0-9._/()-]+$/i.test(record.doi) ? record.doi : linkedDoi ? decodeURIComponent(new URL(linkedDoi).pathname.slice(1)) : '';
      const doi = /^10\.6028\/[a-z0-9._/()-]+$/i.test(candidateDoi) ? candidateDoi : '';
      if (!record.title.length || (!record.id && !doi)) throw new Error('Catalog record missing title or identity; refusing partial import');
      const id = record.id || doi.toLowerCase();
      const link = doi ? 'https://doi.org/' + doi : record.links[0] || 'https://nist.primo.exlibrisgroup.com/discovery/fulldisplay?vid=01NIST_INST:01NIST&docid=alma' + encodeURIComponent(id);
      consume({ id, doi, title:clean(record.title.join(': '),1500), authors:[...new Set(record.authors)].slice(0,40), subjects:[...new Set(record.subjects)].slice(0,100), notes:record.notes.slice(0,20), abstract:clean(record.abstract,8000), year:record.year, series:seriesName(doi,record.rawSeries), url:link, source:'NIST Research Library' });
      record = null;
    }
  };
  return { write:chunk => xml.write(chunk), end:() => { xml.close(); if (stack.length || record || !recordCount) throw new Error('Incomplete catalog'); return recordCount; } };
}
