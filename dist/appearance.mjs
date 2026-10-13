export const DEFAULT_APPEARANCE={theme:'light',accent:'#006d67'};
export function validAppearance(value){return {theme:value?.theme==='dark'?'dark':'light',accent:/^#[0-9a-f]{6}$/i.test(value?.accent||'')?value.accent.toLowerCase():DEFAULT_APPEARANCE.accent};}
function rgb(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));}
function luminance(hex){return rgb(hex).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);}
export function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
export function accessibleAccent(color,theme){
  color=validAppearance({accent:color}).accent;
  const backgrounds=theme==='dark'?['#080d14','#101a24','#14222e','#21333f']:['#ffffff','#f6f8f7','#f1f5f3','#edf5ef','#e4f4ed'];
  const original=rgb(color),target=theme==='dark'?255:0;let adjusted=color;
  for(let step=0;step<=100;step++){
    adjusted='#'+original.map(x=>Math.round(x+(target-x)*step/100).toString(16).padStart(2,'0')).join('');
    if(backgrounds.every(bg=>contrast(adjusted,bg)>=4.5))break;
  }
  const ink=contrast(adjusted,'#000000')>=contrast(adjusted,'#ffffff')?'#000000':'#ffffff';
  return {accent:adjusted,ink,adjusted:adjusted!==color};
}
export function initializeAppearance(document,storage){
  let state={...DEFAULT_APPEARANCE};
  try{state=validAppearance(JSON.parse(storage?.getItem('nist-navigator-appearance')||'null'));}catch{}
  const button=document.getElementById('theme-toggle'),picker=document.getElementById('accent-color');
  const apply=()=>{const colors=accessibleAccent(state.accent,state.theme);document.documentElement.dataset.theme=state.theme;document.documentElement.style.setProperty('--teal',colors.accent);document.documentElement.style.setProperty('--accent-ink',colors.ink);button.setAttribute('aria-pressed',String(state.theme==='dark'));picker.value=state.accent;document.getElementById('appearance-status').textContent=colors.adjusted?'Accent adjusted for readable contrast.':'Accent contrast verified.';try{storage?.setItem('nist-navigator-appearance',JSON.stringify(state));}catch{}};
  button.addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';apply();});
  picker.addEventListener('input',()=>{state=validAppearance({...state,accent:picker.value});apply();});
  apply();
}
