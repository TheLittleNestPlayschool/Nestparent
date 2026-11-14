import{applyTimeAtmosphere}from"../parent_time.js";
import{applyParentGreeting}from"../parent_greeting.js";
import{loadParentData,getStudentMedia,getSignedThumbnails}from"../parent_data.js";
import{activateParentAuth}from"../parent_auth.js?v=2";

if("serviceWorker"in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(error=>console.warn("MyLittleNest test service worker:",error)));
}

let deferredInstallPrompt=null;
const isStandalone=()=>window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
const isAndroid=()=>/android/i.test(navigator.userAgent);
const isMobile=()=>isIOS()||isAndroid();

function setupInstallPrompt(){
  const prompt=document.getElementById("installPrompt");
  const button=document.getElementById("installButton");
  const close=document.getElementById("installClose");
  const title=document.getElementById("installTitle");
  const text=document.getElementById("installText");
  const iosSteps=document.getElementById("iosSteps");
  if(!prompt||!button||!close)return;
  if(isStandalone()){localStorage.setItem("nesthomeInstalled","1");return;}
  if(!isMobile())return;

  const show=()=>{prompt.classList.add("is-visible");prompt.setAttribute("aria-hidden","false");};
  const hide=()=>{prompt.classList.remove("is-visible");prompt.setAttribute("aria-hidden","true");};

  close.addEventListener("click",hide);
  button.hidden=true;
  iosSteps.hidden=true;

  window.addEventListener("appinstalled",()=>{
    deferredInstallPrompt=null;
    localStorage.setItem("nesthomeInstalled","1");
    hide();
  });

  if(isIOS()){
    title.textContent="Add MyLittleNest to your iPhone";
    text.textContent="Safari uses two quick steps to place MyLittleNest on your Home Screen.";
    iosSteps.hidden=false;
    show();
    return;
  }

  window.addEventListener("beforeinstallprompt",event=>{
    event.preventDefault();
    deferredInstallPrompt=event;
    title.textContent="Add MyLittleNest to your phone";
    text.textContent="Keep MyLittleNest one tap away and open it without the browser around it.";
    button.hidden=false;
    show();
  });

  button.addEventListener("click",async()=>{
    if(!deferredInstallPrompt)return;
    const installEvent=deferredInstallPrompt;
    deferredInstallPrompt=null;
    await installEvent.prompt();
    const choice=await installEvent.userChoice;
    if(choice.outcome==="accepted"){
      localStorage.setItem("nesthomeInstalled","1");
      hide();
    }
  });

  setTimeout(()=>{
    if(deferredInstallPrompt)return;
    title.textContent="Add MyLittleNest to your phone";
    text.textContent=localStorage.getItem("nesthomeInstalled")==="1"
      ?"MyLittleNest is already installed. Open it from your Home Screen."
      :"Chrome is not offering the one-tap install on this screen. Tap the ⋮ menu, then choose Add to Home screen or Install app.";
    button.hidden=true;
    iosSteps.hidden=true;
    show();
  },1800);
}

function setupJourneyNavigation(){
  const rail=document.getElementById("journeyRail");
  if(!rail)return;

  let dragging=false;
  let startX=0;
  let startScrollLeft=0;
  let activePointerId=null;

  rail.style.cursor="grab";

  rail.addEventListener("pointerdown",event=>{
    if(event.pointerType!=="mouse"||event.button!==0)return;
    dragging=true;
    activePointerId=event.pointerId;
    startX=event.clientX;
    startScrollLeft=rail.scrollLeft;
    rail.setPointerCapture(event.pointerId);
    rail.style.cursor="grabbing";
    event.preventDefault();
  });

  rail.addEventListener("pointermove",event=>{
    if(!dragging||event.pointerId!==activePointerId)return;
    const distance=event.clientX-startX;
    rail.scrollLeft=startScrollLeft-distance;
    event.preventDefault();
  });

  const stopDragging=event=>{
    if(!dragging||event.pointerId!==activePointerId)return;
    dragging=false;
    if(rail.hasPointerCapture(event.pointerId))rail.releasePointerCapture(event.pointerId);
    activePointerId=null;
    rail.style.cursor="grab";
  };

  rail.addEventListener("pointerup",stopDragging);
  rail.addEventListener("pointercancel",stopDragging);

  rail.addEventListener("wheel",event=>{
    if(Math.abs(event.deltaY)<=Math.abs(event.deltaX))return;
    rail.scrollLeft+=event.deltaY;
    event.preventDefault();
  },{passive:false});
}

function hydrateJourneyHero(){
  const image=document.getElementById("journeyHeroImage");
  const fallback=document.getElementById("journeyHeroFallback");
  if(!image||!fallback)return;

  const media=getStudentMedia();
  const thumbnails=getSignedThumbnails();
  const candidates=media
    .map((item,index)=>({item,url:thumbnails[index]||""}))
    .filter(entry=>!entry.item?.is_deleted&&String(entry.url).trim())
    .sort((a,b)=>(Number(b.item?.created_at)||0)-(Number(a.item?.created_at)||0));

  const heroUrl=candidates[0]?.url||"";
  if(!heroUrl)return;

  image.addEventListener("load",()=>{
    image.hidden=false;
    fallback.hidden=true;
  },{once:true});

  image.addEventListener("error",()=>{
    image.hidden=true;
    fallback.hidden=false;
  },{once:true});

  image.src=heroUrl;
}

let appStarted=false;
async function startParentApp(){
  if(appStarted)return;
  appStarted=true;
  try{
    await loadParentData();
    applyTimeAtmosphere();
    applyParentGreeting();
    hydrateJourneyHero();
  }catch(error){
    appStarted=false;
    console.error("Unable to start MyLittleNest test:",error);
  }
}

setupInstallPrompt();
setupJourneyNavigation();
activateParentAuth(startParentApp);
