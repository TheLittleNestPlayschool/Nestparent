import{applyTimeAtmosphere}from"../parent_time.js";
import{applyParentGreeting}from"../parent_greeting.js";
import{loadParentData}from"../parent_data.js";
import{activateParentAuth}from"../parent_auth.js?v=2";
if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(error=>console.warn('NestHome test service worker:',error)));}
let appStarted=false;
async function startParentApp(){if(appStarted)return;appStarted=true;try{await loadParentData();applyTimeAtmosphere();applyParentGreeting();}catch(error){appStarted=false;console.error("Unable to start NestHome test:",error);}}
activateParentAuth(startParentApp);
