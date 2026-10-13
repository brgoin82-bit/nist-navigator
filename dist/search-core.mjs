export const AREA_RULES = [
  ['Governance, Risk & Compliance', /\bgovernance\b|\bcompliance\b|enterprise risk|risk management|risk assessment|security and privacy controls|control baselines|assessing security|cybersecurity framework|privacy framework|\b800-(?:30|37|39|53|55|171|172)\b|\b8286/i],
  ['Data centers & infrastructure', /\bdata\s*cent(?:er|re)s?\b|server room|computer room|cloud computing|virtualization|disaster recovery|contingency planning|uninterruptible power|power distribution|data center cooling/i],
  ['Cybersecurity & risk', /cyber|security|cryptograph|vulnerab|incident response|zero trust|800-53|800-171|800-61|risk management framework|information systems/i],
  ['Privacy & identity', /privacy|identity|identities|authentication|biometric|personal information|digital identity|password/i],
  ['AI & data science', /artificial intelligence|machine learning|neural network|data science|generative|algorithmic/i],
  ['Networks & communications', /telecommunicat|wireless|network|internet|communication|radio|spectrum|broadband/i],
  ['Physics & quantum', /physics|quantum|atomic|atom |neutron|nuclear|photon|electron|optical|laser|radiation|magnetic|electromagnet/i],
  ['Chemistry & materials', /chemistr|chemical|material|polymer|metal|alloy|nanotech|semiconductor|spectro|thermodynamic/i],
  ['Buildings & fire safety', /fire|building|construction|structur|concrete|earthquake|disaster|flammab/i],
  ['Manufacturing & engineering', /manufactur|engineer|machining|robot|industrial|mechanic|additive|fabricat/i],
  ['Measurement & calibration', /measurement|calibrat|metrolog|reference material|reference data|standard reference|weights|units|uncertainty/i],
  ['Health & bioscience', /health|medical|biolog|bioscience|dna|genom|protein|forensic|clinical|pharma/i],
  ['Math & statistics', /mathematic|statistic|numerical|probability|computational|optimization/i],
  ['Energy & environment', /energy|environment|climate|electric power|solar|fuel|renewable|hydrogen|pollution/i],
];
export const AREAS = [...AREA_RULES.map(x=>x[0]), 'Other & unclassified'];
export function inferAreas(record) {
  const text=[record.title,record.doi,record.abstract,...(record.subjects||[])].join(' ');
  const result=AREA_RULES.filter(([,rule])=>rule.test(text)).map(([name])=>name);
  return result.length?result:['Other & unclassified'];
}
export function normalize(value) {
  return String(value??'').slice(0,32000).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
}
const STOP = new Set('a an the of for in on to and or is are be what how do does i my me with about from by please find show need looking guide guidance'.split(' '));
const SYNONYMS = {
  mfa:['multifactor','authentication'], passwords:['password','authentication','identity'], password:['password','authentication','identity'],
  iam:['identity','authentication'], ai:['artificial','intelligence'], ml:['machine','learning'],
  '2fa':['multifactor','authentication'], encryption:['encryption','cryptography','cryptographic'],
  hackers:['cybersecurity','security'], hacking:['cybersecurity','security'], breach:['breach','incident','response'],
  ransomware:['ransomware','incident','response'], rmf:['risk','management','framework'],
  csf:['cybersecurity','framework'], grc:['governance','risk','compliance'], backup:['backup','contingency','recovery'], backups:['backup','contingency','recovery'],
  pii:['privacy','personal','information'], infosec:['information','security'],
};
export function distance(a,b,max=2) {
  if(a===b)return 0;if(Math.abs(a.length-b.length)>max)return max+1;
  let older=null,prior=Array.from({length:b.length+1},(_,i)=>i);
  for(let i=1;i<=a.length;i++) {
    const row=[i];let minimum=i;
    for(let j=1;j<=b.length;j++) {
      let value=Math.min(row[j-1]+1,prior[j]+1,prior[j-1]+(a[i-1]===b[j-1]?0:1));
      if(older&&i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1])value=Math.min(value,older[j-2]+1);
      row[j]=value;minimum=Math.min(minimum,value);
    }
    if(minimum>max)return max+1;older=prior;prior=row;
  }
  return prior[b.length];
}
export function validateCatalog(data) {
  if(!data?.meta||!Array.isArray(data.records)||data.records.length<1||data.records.length>100000||data.meta.indexedRecords!==data.records.length)throw new Error('Invalid or incomplete catalog');
  const ids=new Set();
  for(const r of data.records) {
    if(typeof r.id!=='string'||ids.has(r.id)||typeof r.title!=='string'||!r.title||r.title.length>1500||typeof r.doi!=='string'||typeof r.url!=='string'||!Array.isArray(r.subjects)||r.subjects.length>100||r.subjects.some(x=>typeof x!=='string'||x.length>32000)||!Array.isArray(r.authors)||r.authors.length>40||r.authors.some(x=>typeof x!=='string')||!Array.isArray(r.notes)||!Array.isArray(r.areas)||r.areas.some(x=>!AREAS.includes(x))||typeof r.abstract!=='string'||r.abstract.length>8000||(r.year!==null&&(!Number.isInteger(r.year)||r.year<1800||r.year>2100)))throw new Error('Invalid catalog record');
    const u=new URL(r.url);if(u.protocol!=='https:'||u.username||u.password||u.port||!(u.hostname==='doi.org'||u.hostname==='nist.gov'||u.hostname.endsWith('.nist.gov')||u.hostname==='nist.primo.exlibrisgroup.com'))throw new Error('Untrusted publication link');
    ids.add(r.id);
  }
  return data;
}

export function createSearch(records) {
  const postings=new Map(),vocabulary=[],titleIndex=[];
  const subjects=new Map(),series=new Map(),areaCounts=new Map(AREAS.map(a=>[a,0]));
  for(let i=0;i<records.length;i++) {
    const r=records[i];titleIndex[i]=normalize(r.title+' '+r.doi);
    const text=normalize([r.title,r.doi,r.series,...r.subjects,...r.authors,r.abstract.slice(0,3000)].join(' '));
    for(const token of new Set(text.split(' ').filter(x=>x.length>=2&&x.length<=40&&!STOP.has(x)).slice(0,400))) {
      if(!postings.has(token)){postings.set(token,[]);vocabulary.push(token);}
      postings.get(token).push(i);
    }
    for(const s of r.subjects)subjects.set(s,(subjects.get(s)||0)+1);
    series.set(r.series,(series.get(r.series)||0)+1);
    for(const a of r.areas)areaCounts.set(a,(areaCounts.get(a)||0)+1);
  }
  function expand(term) {
    const matches=new Map();
    if(postings.has(term))matches.set(term,1);
    for(const word of SYNONYMS[term]||[])if(postings.has(word))matches.set(word,.75);
    if(term.length>=2)for(const word of vocabulary)if(word.startsWith(term)&&!matches.has(word)){matches.set(word,.85);if(matches.size>=80)break;}
    if(term.length>=4) {
      const candidates=[];
      for(const word of vocabulary)if(Math.abs(word.length-term.length)<=2 && word.length>=4 && !matches.has(word)){
        const d=distance(term,word,term.length>=8?2:1);if(d<=(term.length>=8?2:1))candidates.push([word,d]);
      }
      candidates.sort((a,b)=>a[1]-b[1]||a[0].localeCompare(b[0]));
      for(const [word,d] of candidates.slice(0,20))matches.set(word,d===1?.65:.45);
    }
    return matches;
  }
  function search({query='',area='',subject='',series:seriesFilter='',from='',to='',sort='relevance',page=0,pageSize=20}={}) {
    query=String(query).slice(0,200);
    const terms=[...new Set(normalize(query).split(' ').filter(x=>x&&!STOP.has(x)))].slice(0,12);
    const scores=new Map(),coverage=new Map();
    for(const term of terms) {
      const best=new Map();
      for(const [word,weight] of expand(term))for(const i of postings.get(word)||[])best.set(i,Math.max(best.get(i)||0,weight));
      for(const [i,weight] of best){scores.set(i,(scores.get(i)||0)+weight);coverage.set(i,(coverage.get(i)||0)+1);}
    }
    const candidates=terms.length?[...scores.keys()]:records.map((_,i)=>i);
    const filtered=candidates.filter(i=>{
      const r=records[i];return (!area||r.areas.includes(area))&&(!subject||r.subjects.includes(subject))&&(!seriesFilter||r.series===seriesFilter)&&(!from||(r.year!==null&&r.year>=Number(from)))&&(!to||(r.year!==null&&r.year<=Number(to)));
    });
    const strong=terms.length?filtered.filter(i=>coverage.get(i)===terms.length):filtered;
    const related=terms.length>1&&!strong.length;
    const result=strong.length||!terms.length?strong:filtered;
    result.sort((a,b)=>{
      if(sort==='oldest')return (records[a].year??9999)-(records[b].year??9999)||records[a].id.localeCompare(records[b].id);
      if(sort==='title')return records[a].title.localeCompare(records[b].title)||records[a].id.localeCompare(records[b].id);
      if(sort==='relevance'&&terms.length) {
        const boost=i=>(coverage.get(i)||0)*10+(scores.get(i)||0)+(titleIndex[i].includes(normalize(query))?8:0);
        const delta=boost(b)-boost(a);if(delta)return delta;
      }
      return (records[b].year??0)-(records[a].year??0)||records[a].id.localeCompare(records[b].id);
    });
    const safeSize=Math.min(50,Math.max(1,Number(pageSize)||20)),safePage=Math.max(0,Math.floor(Number(page)||0));
    return {total:result.length,page:safePage,pageSize:safeSize,related,items:result.slice(safePage*safeSize,(safePage+1)*safeSize).map(i=>records[i])};
  }
  function suggest(query,filters={}) {
    query=String(query).slice(0,200);if(normalize(query).length<2)return [];
    const normalized=normalize(query),suggestions=[];
    const matchedSubjects=[...subjects.keys()].filter(s=>normalize(s).includes(normalized)).sort((a,b)=>(subjects.get(b)-subjects.get(a))||a.localeCompare(b));
    for(const s of matchedSubjects.slice(0,3))suggestions.push({type:'subject',label:s,value:s,detail:subjects.get(s)+' catalog records'});
    for(const r of search({...filters,query,pageSize:5,sort:'relevance'}).items)suggestions.push({type:'publication',label:r.title,value:r.title,detail:r.doi||r.series,id:r.id});
    return suggestions.slice(0,8);
  }
  return {search,suggest,facets:{areas:[...areaCounts],subjects:[...subjects].sort((a,b)=>a[0].localeCompare(b[0])),series:[...series].sort((a,b)=>a[0].localeCompare(b[0]))}};
}
