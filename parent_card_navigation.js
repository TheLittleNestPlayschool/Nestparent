const NAV_APPEAR_DELAY=1320;
const showTimers=new WeakMap();

/*   get navigation*/
function getNavigation(card,offset){
  if(!card){return null;}

  if(
    offset===1&&
    card.classList.contains("is-stage-back")
  ){
    return{
      label:"Back",
      side:"right",
      arrow:"→"
    };
  }

  if(card.hasAttribute("data-index")){
    if(offset===1){
      return{
        label:"More",
        side:"right",
        arrow:"→"
      };
    }

    if(offset===-1){
      return{
        label:"Back",
        side:"left",
        arrow:"←"
      };
    }
  }

  return null;
}

/*   navigation target*/
export function isCardNavigationTarget(card,offset){
  return Boolean(getNavigation(card,offset));
}

/*   navigation key*/
function getNavigationKey(navigation){
  if(!navigation){return "";}
  return`${navigation.side}:${navigation.label}`;
}

/*   clear show timer*/
function clearShowTimer(card){
  const timer=showTimers.get(card);
  if(!timer){return;}
  clearTimeout(timer);
  showTimers.delete(card);
}

/*   remove handle*/
function removeHandle(card){
  if(!card){return;}
  clearShowTimer(card);

  const handle=card.querySelector(":scope > .card-nav-handle");
  if(handle){handle.remove();}

  card.classList.remove(
    "has-nav-handle",
    "has-nav-handle-left",
    "has-nav-handle-right"
  );
}

/*   create handle*/
function createHandle(card,navigation){
  const handle=document.createElement("button");
  handle.type="button";
  handle.className="card-nav-handle";
  handle.setAttribute(
    "aria-label",
    navigation.label==="Back"
      ?"Go back"
      :"Show more"
  );

  handle.innerHTML=`
    <span class="card-nav-handle-arrow">${navigation.arrow}</span>
    <span class="card-nav-handle-label">${navigation.label}</span>
  `;

  card.appendChild(handle);
  return handle;
}

/*   show handle*/
function showHandle(card,navigation){
  clearShowTimer(card);

  let handle=card.querySelector(":scope > .card-nav-handle");
  if(!handle){
    handle=createHandle(card,navigation);
  }

  handle.disabled=false;
  handle.dataset.navKey=getNavigationKey(navigation);

  handle.querySelector(".card-nav-handle-arrow").textContent=navigation.arrow;
  handle.querySelector(".card-nav-handle-label").textContent=navigation.label;

  handle.setAttribute(
    "aria-label",
    navigation.label==="Back"
      ?"Go back"
      :"Show more"
  );

  card.classList.remove(
    "has-nav-handle-left",
    "has-nav-handle-right"
  );

  card.classList.add(
    "has-nav-handle",
    navigation.side==="right"
      ?"has-nav-handle-right"
      :"has-nav-handle-left"
  );
}

/*   show handle after card arrives*/
function scheduleHandle(card,navigation,offset){
  removeHandle(card);

  const navigationKey=getNavigationKey(navigation);

  const timer=window.setTimeout(()=>{
    showTimers.delete(card);

    const currentNavigation=getNavigation(card,offset);
    if(!currentNavigation){return;}

    if(
      String(card.dataset.pos)!==String(offset)||
      getNavigationKey(currentNavigation)!==navigationKey
    ){
      return;
    }

    showHandle(card,currentNavigation);
  },NAV_APPEAR_DELAY);

  showTimers.set(card,timer);
}

/*   sync navigation*/
export function syncCardNavigation(card,offset){
  if(!card){return;}

  const navigation=getNavigation(card,offset);
  const handle=card.querySelector(":scope > .card-nav-handle");

  if(!navigation){
    removeHandle(card);
    return;
  }

  const navigationKey=getNavigationKey(navigation);
  const alreadySettled=String(card.dataset.pos)===String(offset);
  const sameHandle=handle?.dataset.navKey===navigationKey;

  if(alreadySettled&&sameHandle){
    showHandle(card,navigation);
    return;
  }

  scheduleHandle(card,navigation,offset);
}

/*   clear old fixed navigation*/
export function clearLegacyStageNavigation(carousel){
  if(!carousel){return;}
  carousel
    .querySelectorAll(".stage-nav-button")
    .forEach(button=>button.remove());
}
