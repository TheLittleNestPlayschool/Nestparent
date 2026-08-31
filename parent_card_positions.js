let navigationFrame=null;

/*   remove legacy card cue*/
function removeLegacyCardCue(card){
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

/*   remove stage navigation button*/
function removeStageNavigationButton(
  carousel
){
  if(!carousel){
    return;
  }

  const button=
    carousel.querySelector(
      ":scope > .stage-nav-button"
    );

  if(button){
    button.remove();
  }
}

/*   get right navigation target*/
function getRightNavigationTarget(
  carousel
){
  if(!carousel){
    return null;
  }

  const cards=[
    ...carousel.querySelectorAll(
      '.experience[data-pos="1"]'
    )
  ];

  /*
    Deeper navigation takes priority.

    Several cards can technically remain
    at offset 1 underneath each other.
    The newest one in the DOM is the
    level immediately behind the current
    experience.
  */
  const backCards=
    cards.filter(
      card=>
        card.classList.contains(
          "is-stage-back"
        )
    );

  if(backCards.length){
    return{
      card:
        backCards[
          backCards.length-1
        ],
      label:"Back"
    };
  }

  /*
    On the main Experience Engine,
    the next experience is the More target.
  */
  const moreCards=
    cards.filter(
      card=>
        card.hasAttribute(
          "data-index"
        )
    );

  if(moreCards.length){
    return{
      card:moreCards[0],
      label:"More"
    };
  }

  return null;
}

/*   sync stage navigation button*/
function syncStageNavigationButton(
  carousel
){
  removeStageNavigationButton(
    carousel
  );

  const target=
    getRightNavigationTarget(
      carousel
    );

  if(!target){
    return;
  }

  const button=
    document.createElement(
      "button"
    );

  button.type="button";
  button.className=
    "stage-nav-button";

  button.setAttribute(
    "aria-label",
    target.label==="Back"
      ?"Go back"
      :"Show more"
  );

  button.innerHTML=`
    <span class="stage-nav-arrow">
      ←
    </span>

    <span class="stage-nav-label">
      ${target.label}
    </span>
  `;

  button.addEventListener(
    "click",
    event=>{
      event.preventDefault();
      event.stopPropagation();

      target.card.click();
    }
  );

  carousel.appendChild(
    button
  );
}

/*   schedule navigation sync*/
function scheduleStageNavigationSync(
  carousel
){
  if(!carousel){
    return;
  }

  if(navigationFrame){
    cancelAnimationFrame(
      navigationFrame
    );
  }

  navigationFrame=
    requestAnimationFrame(
      ()=>{
        navigationFrame=null;

        syncStageNavigationButton(
          carousel
        );
      }
    );
}

/*   render card offset*/
export function renderCardOffset(
  card,
  offset
){
  if(!card){
    return;
  }

  removeLegacyCardCue(
    card
  );

  const carousel=
    card.parentElement;

  if(
    offset < -2||
    offset > 2
  ){
    card.style.opacity="0";
    card.style.pointerEvents="none";

    card.style.transform=`
      translate(-50%,-50%)
      translateX(
        ${offset*64}%
      )
      scale(.74)
    `;

    card.style.filter=
      "blur(9px)";

    card.style.zIndex="4";

    card.dataset.pos=
      offset;

    scheduleStageNavigationSync(
      carousel
    );

    return;
  }

  const isNavigationCard=
    offset===1&&
    (
      card.classList.contains(
        "is-stage-back"
      )||
      card.hasAttribute(
        "data-index"
      )
    );

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
    Math.abs(
      offset
    )*10;

  const opacity=
    offset===0
      ?1
      :isNavigationCard
        ?.72
        :.46;

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
    rotate(
      ${rotate}deg
    )
    scale(
      ${scale}
    )
  `;

  card.style.zIndex=
    10-
    Math.abs(
      offset
    );

  card.dataset.pos=
    offset;

  scheduleStageNavigationSync(
    carousel
  );
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
    removeLegacyCardCue(
      card
    );

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

    scheduleStageNavigationSync(
      card.parentElement
    );

    return;
  }

  const offset=
    relativeIndex+1;

  renderCardOffset(
    card,
    offset
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

  scheduleStageNavigationSync(
    carousel
  );
}
