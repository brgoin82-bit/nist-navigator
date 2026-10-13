export const DEFAULT_APPEARANCE={theme:'light',accent:'#006d67'};
export function validAppearance(value){return {theme:value?.theme==='dark'?'dark':'light',accent:/^#[0-9a-f]{6}$/i.test(value?.accent||'')?value.accent.toLowerCase():DEFAULT_APPEARANCE.accent};}
function rgb(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));}
function luminance(hex){return rgb(hex).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0);}
export function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
export function accessibleAccent(color,theme){
  color=validAppearance({accent:color}).accent;
  const backgrounds=theme==='dark'?['#080d14','#101a24','#14222e','#21333f']:['#ffffff','#f6f8f7','#f1f5f3','#edf5ef','#e4f4ed'];
  const original=rgb(color),target=theme==='dark'?255:0;
  const mix=step=>'#'+original.map(x=>Math.round(x+(target-x)*step/255).toString(16).padStart(2,'0')).join('');
  const readable=value=>backgrounds.every(bg=>contrast(value,bg)>=4.5);
  let low=0,high=255;
  while(low<high){const middle=Math.floor((low+high)/2);if(readable(mix(middle)))high=middle;else low=middle+1;}
  const adjusted=mix(low);
  const ink=contrast(adjusted,'#000000')>=contrast(adjusted,'#ffffff')?'#000000':'#ffffff';
  return {accent:adjusted,ink,adjusted:adjusted!==color};
}
export function hexToHsl(hex){
  const [r,g,b]=rgb(validAppearance({accent:hex}).accent).map(x=>x/255),maximum=Math.max(r,g,b),minimum=Math.min(r,g,b),d=maximum-minimum,l=(maximum+minimum)/2;
  let h=0,s=0;if(d){s=d/(1-Math.abs(2*l-1));h=maximum===r?((g-b)/d)%6:maximum===g?(b-r)/d+2:(r-g)/d+4;h=(h*60+360)%360;}
  return {h:Math.round(h)%360,s:Math.round(s*100),l:Math.round(l*100)};
}
export function hslToHex(h,s,l){
  h=Math.max(0,Math.min(359,Number(h)||0));s=Math.max(0,Math.min(100,Number(s)||0))/100;l=Math.max(0,Math.min(100,Number(l)||0))/100;
  const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
  const values=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
  return '#'+values.map(v=>Math.round((v+m)*255).toString(16).padStart(2,'0')).join('');
}
export function initializeAppearance(document,storage){
  let state={...DEFAULT_APPEARANCE};
  try{state=validAppearance(JSON.parse(storage?.getItem('nist-navigator-appearance')||'null'));}catch{}
  const $=id=>document.getElementById(id),button=$('theme-toggle'),picker=$('accent-color'),panel=$('accent-panel'),toggle=$('accent-toggle');
  const frame=document.defaultView?.requestAnimationFrame?.bind(document.defaultView)|| (fn=>{fn();return null;});
  const cancel=document.defaultView?.cancelAnimationFrame?.bind(document.defaultView)||(()=>{});
  let pending=null,hsl=hexToHsl(state.accent);
  const save=()=>{try{storage?.setItem('nist-navigator-appearance',JSON.stringify(state));}catch{}};
  const paint=()=>{pending=null;const colors=accessibleAccent(state.accent,state.theme);document.documentElement.dataset.theme=state.theme;document.documentElement.style.setProperty('--teal',colors.accent);document.documentElement.style.setProperty('--accent-ink',colors.ink);document.documentElement.style.setProperty('--chosen-accent',state.accent);document.documentElement.style.setProperty('--picker-hue',String(hsl.h));button.setAttribute('aria-pressed',String(state.theme==='dark'));$('accent-preview').textContent='Live preview · '+colors.accent.toUpperCase();};
  const queuePaint=()=>{if(pending===null)pending=frame(paint);};
  const announce=()=>{const colors=accessibleAccent(state.accent,state.theme);$('appearance-status').textContent=colors.adjusted?'Applied '+colors.accent.toUpperCase()+'; brightness adjusted for readable contrast.':'Applied '+colors.accent.toUpperCase()+'. Contrast verified.';};
  const commit=()=>{if(pending!==null){cancel(pending);pending=null;}paint();save();announce();};
  const syncControls=()=>{picker.value=state.accent.toUpperCase();for(const [id,value]of [['accent-hue',hsl.h],['accent-saturation',hsl.s],['accent-lightness',hsl.l]])$(id).value=String(value);};
  const close=()=>{panel.hidden=true;toggle.setAttribute('aria-expanded','false');commit();};
  button.addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';commit();});
  toggle.addEventListener('click',()=>{if(!panel.hidden){close();return;}panel.hidden=false;toggle.setAttribute('aria-expanded','true');$('accent-hue').focus();});
  $('accent-done').addEventListener('click',()=>{close();toggle.focus();});
  panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close();toggle.focus();}});
  document.addEventListener?.('pointerdown',event=>{if(!panel.hidden&&!panel.contains(event.target)&&!toggle.contains(event.target))close();});
  const readHex=()=>{const value=picker.value.trim();if(!/^#[0-9a-f]{6}$/i.test(value)){picker.setAttribute('aria-invalid','true');return false;}picker.setAttribute('aria-invalid','false');state.accent=value.toLowerCase();hsl=hexToHsl(state.accent);for(const [id,v]of [['accent-hue',hsl.h],['accent-saturation',hsl.s],['accent-lightness',hsl.l]])$(id).value=String(v);queuePaint();return true;};
  picker.addEventListener('input',readHex);picker.addEventListener('change',()=>{if(readHex())commit();else $('appearance-status').textContent='Enter a six-digit color such as #7C3AED. Your last valid accent is unchanged.';});
  for(const id of ['accent-hue','accent-saturation','accent-lightness']){
    const readSlider=()=>{hsl={h:Number($('accent-hue').value),s:Number($('accent-saturation').value),l:Number($('accent-lightness').value)};state.accent=hslToHex(hsl.h,hsl.s,hsl.l);picker.value=state.accent.toUpperCase();picker.setAttribute('aria-invalid','false');queuePaint();};
    $(id).addEventListener('input',readSlider);$(id).addEventListener('change',()=>{readSlider();commit();});
  }
  for(const preset of document.querySelectorAll?.('[data-accent]')||[])preset.addEventListener('click',()=>{state.accent=validAppearance({accent:preset.dataset.accent}).accent;hsl=hexToHsl(state.accent);syncControls();commit();});
  syncControls();paint();announce();
}
