const EXIT_TIME=1450;
const exitTimers=new WeakMap();

/*   get navigation*/
function getNavigation(card,offset){
  if(!card){
    return null;
  }

  if(
    offset===1&&
    card.classList.contains(
      "is-stage-back"
    )
  ){
    return{
      label:"Back",
      side:"right",
      arrow:"‹"
    };
  }

  if(
    card.hasAttribute(
      "data-index"
    )
  ){
    if(offset===1){
      return{
        label:"More",
        side:"right",
        arrow:"‹"
      };
    }

    if(offset===-1){
      return{
        label:"Back",
        side:"left",
        arrow:"›"
      };
    }
  }

  return null;
}

/*   navigation target*/
export function isCardNavigationTarget(
  card,
  offset
){
  return Boolean(
    getNavigation(
      card,
      offset
    )
  );
}

/*   remove handle*/
function removeHandle(card){
  if(!card){
    return;
  }

  const timer=
    exitTimers.get(card);

  if(timer){
    clearTimeout(timer);
    exitTimers.delete(card);
  }

  const handle=
    card.querySelector(
      ":scope > .card-nav-handle"
    );

  if(handle){
    handle.remove();
  }

  card.classList.remove(
    "has-nav-handle",
    "has-nav-handle-left",
    "has-nav-handle-right"
  );
}

/*   create handle*/
function createHandle(
  card,
  navigation
){
  const handle=
    document.createElement(
      "button"
    );

  handle.type="button";
  handle.className=
    "card-nav-handle";

  handle.setAttribute(
    "aria-label",
    navigation.label==="Back"
      ?"Go back"
      :"Show more"
  );

  handle.innerHTML=`
    <span class="card-nav-handle-arrow">
      ${navigation.arrow}
    </span>

    <span class="card-nav-handle-label">
      ${navigation.label}
    </span>
  `;

  card.appendChild(
    handle
  );

  return handle;
}

/*   show handle*/
function showHandle(
  card,
  navigation
){
  const timer=
    exitTimers.get(card);

  if(timer){
    clearTimeout(timer);
    exitTimers.delete(card);
  }

  let handle=
    card.querySelector(
      ":scope > .card-nav-handle"
    );

  if(!handle){
    handle=
      createHandle(
        card,
        navigation
      );
  }

  handle.disabled=false;

  handle.classList.remove(
    "is-travelling"
  );

  handle.querySelector(
    ".card-nav-handle-arrow"
  ).textContent=
    navigation.arrow;

  handle.querySelector(
    ".card-nav-handle-label"
  ).textContent=
    navigation.label;

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

  handle.dataset.originSide=
    navigation.side;
}

/*   let handle travel into center*/
function letHandleTravel(card){
  const handle=
    card.querySelector(
      ":scope > .card-nav-handle"
    );

  if(
    !handle||
    handle.classList.contains(
      "is-travelling"
    )
  ){
    return;
  }

  handle.disabled=true;

  handle.classList.add(
    "is-travelling"
  );

  const timer=
    window.setTimeout(
      ()=>{
        removeHandle(card);
      },
      EXIT_TIME
    );

  exitTimers.set(
    card,
    timer
  );
}

/*   sync navigation*/
export function syncCardNavigation(
  card,
  offset
){
  if(!card){
    return;
  }

  const navigation=
    getNavigation(
      card,
      offset
    );

  if(navigation){
    showHandle(
      card,
      navigation
    );

    return;
  }

  const handle=
    card.querySelector(
      ":scope > .card-nav-handle"
    );

  if(
    handle&&
    offset===0
  ){
    letHandleTravel(card);
    return;
  }

  removeHandle(card);
}

/*   clear old fixed navigation*/
export function clearLegacyStageNavigation(
  carousel
){
  if(!carousel){
    return;
  }

  carousel
    .querySelectorAll(
      ".stage-nav-button"
    )
    .forEach(
      button=>button.remove()
    );
}
