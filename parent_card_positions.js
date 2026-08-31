/*   remove card navigation cue*/
function removeCardNavigationCue(card){
  if(!card){
    return;
  }

  const cue=
    card.querySelector(
      ":scope > .card-nav-cue"
    );

  if(cue){
    cue.remove();
  }

  card.classList.remove(
    "has-card-nav-cue",
    "has-card-nav-cue-left",
    "has-card-nav-cue-right"
  );

  delete card.dataset.navLabel;
}

/*   add card navigation cue*/
function setCardNavigationCue(
  card,
  label,
  offset
){
  removeCardNavigationCue(card);

  if(
    !label||
    Math.abs(offset)!==1
  ){
    return;
  }

  const cue=
    document.createElement(
      "button"
    );

  const arrow=
    offset>0
      ?"←"
      :"→";

  cue.type="button";
  cue.className="card-nav-cue";

  cue.setAttribute(
    "aria-label",
    label
  );

  cue.innerHTML=`
    <span class="card-nav-cue-arrow">
      ${arrow}
    </span>

    <span class="card-nav-cue-label">
      ${label}
    </span>
  `;

  card.dataset.navLabel=
    label;

  card.classList.add(
    "has-card-nav-cue"
  );

  card.classList.add(
    offset>0
      ?"has-card-nav-cue-right"
      :"has-card-nav-cue-left"
  );

  card.appendChild(cue);
}

/*   get navigation label*/
function getNavigationLabel(
  card,
  offset,
  explicitLabel
){
  if(explicitLabel){
    return explicitLabel;
  }

  if(Math.abs(offset)!==1){
    return null;
  }

  if(
    card.classList.contains(
      "is-stage-back"
    )
  ){
    return "Back";
  }

  if(
    card.hasAttribute(
      "data-index"
    )
  ){
    return offset>0
      ?"More"
      :"Back";
  }

  return null;
}

/*   render card offset*/
export function renderCardOffset(
  card,
  offset,
  navigationLabel=null
){
  if(!card){
    return;
  }

  if(
    offset < -2||
    offset > 2
  ){
    removeCardNavigationCue(card);

    card.style.opacity="0";
    card.style.pointerEvents="none";

    card.style.transform=`
      translate(-50%,-50%)
      translateX(${offset*64}%)
      scale(.74)
    `;

    card.style.filter="blur(9px)";
    card.style.zIndex="4";
    card.dataset.pos=offset;

    return;
  }

  const navLabel=
    getNavigationLabel(
      card,
      offset,
      navigationLabel
    );

  const isNavigationCard=
    Boolean(navLabel)&&
    Math.abs(offset)===1;

  const x=
    offset*73;

  const scale=
    offset===0
      ?1
      :.86;

  const rotate=
    offset*-2.6;

  const z=
    offset===0
      ?0
      :-90;

  const y=
    Math.abs(offset)*10;

  const opacity=
    offset===0
      ?1
      :isNavigationCard
        ?.72
        :.46;

  setCardNavigationCue(
    card,
    navLabel,
    offset
  );

  card.style.opacity=
    opacity;

  card.style.pointerEvents=
    offset===0||
    isNavigationCard
      ?"auto"
      :"none";

  card.style.filter=
    offset===0
      ?"blur(0px)"
      :isNavigationCard
        ?"blur(.6px)"
        :"blur(1.4px)";

  card.style.transform=`
    translate(-50%,-50%)
    translate3d(
      ${x}%,
      ${y}px,
      ${z}px
    )
    rotate(${rotate}deg)
    scale(${scale})
  `;

  card.style.zIndex=
    10-Math.abs(offset);

  card.dataset.pos=
    offset;
}

/*   render nest mode position*/
export function renderNestModePosition(
  card,
  index,
  activeIndex
){
  const relativeIndex=
    index-activeIndex;

  if(relativeIndex<0){
    removeCardNavigationCue(card);

    card.style.opacity="0";
    card.style.pointerEvents="none";
    card.style.filter="blur(8px)";

    card.style.transform=`
      translate(-50%,-50%)
      translate3d(
        -64%,
        10px,
        -120px
      )
      rotate(2.6deg)
      scale(.78)
    `;

    card.style.zIndex="5";
    card.dataset.pos=-1;

    return;
  }

  const offset=
    relativeIndex+1;

  renderCardOffset(
    card,
    offset,
    relativeIndex===0
      ?"Back"
      :null
  );
}

/*   render all positions*/
export function renderCardPositions({
  carousel,
  activeIndex,
  nestOpen
}){
  if(!carousel){
    return;
  }

  const cards=[
    ...carousel.querySelectorAll(
      ".experience:not(.nest-experience)"
    )
  ];

  cards.forEach(
    (
      card,
      index
    )=>{
      if(nestOpen){
        renderNestModePosition(
          card,
          index,
          activeIndex
        );

        return;
      }

      const offset=
        index-activeIndex;

      renderCardOffset(
        card,
        offset
      );
    }
  );
}
