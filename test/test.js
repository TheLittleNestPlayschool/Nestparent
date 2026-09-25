import{applyTimeAtmosphere}from"../parent_time.js";
import{applyParentGreeting}from"../parent_greeting.js";
import{loadParentData}from"../parent_data.js";
import{activateParentAuth}from"../parent_auth.js?v=2";
if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(error=>console.warn('NestHome test service worker:',error)));}
let deferredInstallPrompt=null;
const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
function setupInstallPrompt(){const prompt=document.getElementById('installPrompt');const button=document.getElementById('installButton');const close=document.getElementById('installClose');const title=document.getElementById('installTitle');const text=document.getElementById('installText');const iosSteps=document.getElementById('iosSteps');if(!prompt||!button||!close||isStandalone())return;const show=()=>{prompt.classList.add('is-visible');prompt.setAttribute('aria-hidden','false');};const hide=()=>{prompt.classList.remove('is-visible');prompt.setAttribute('aria-hidden','true');};close.addEventListener('click',hide);window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;hide();});if(isIOS()){title.textContent='Add NestHome to your iPhone';text.textContent='Safari uses two quick taps to place NestHome on your Home Screen.';button.hidden=true;iosSteps.hidden=false;show();return;}window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;button.hidden=false;iosSteps.hidden=true;show();});button.addEventListener('click',async()=>{if(!deferredInstallPrompt){text.textContent='Chrome is getting the install ready. Wait a moment, then tap Install NestHome again.';return;}const installEvent=deferredInstallPrompt;deferredInstallPrompt=null;await installEvent.prompt();const choice=await installEvent.userChoice;if(choice.outcome==='accepted')hide();});setTimeout(()=>{if(!deferredInstallPrompt&&!isIOS()){title.textContent='Add NestHome to your phone';text.textContent='If the install button is not ready yet, open Chrome’s menu and choose Install app.';button.hidden=true;show();}},1800);}
let appStarted=false;
async function startParentApp(){if(appStarted)return;appStarted=true;try{await loadParentData();applyTimeAtmosphere();applyParentGreeting();}catch(error){appStarted=false;console.error("Unable to start NestHome test:",error);}}
setupInstallPrompt();
activateParentAuth(startParentApp);
