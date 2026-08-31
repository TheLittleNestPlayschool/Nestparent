import{
  clearLegacyStageNavigation,
  isCardNavigationTarget,
  syncCardNavigation
}from"./parent_card_navigation.js";

/*   render card offset*/
export function renderCardOffset(
  card,
  offset
){
  if(!card){
    return;
  }

  if(
    offset < -2||
    offset > 2
  ){
    syncCardNavigation(
      card,
      offset
    );

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
    card.dataset.pos=offset;

    return;
  }

  const isNavigationCard=
    isCardNavigationTarget(
      card,
      offset
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

  syncCardNavigation(
    card,
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
    syncCardNavigation(
      card,
      -3
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

  clearLegacyStageNavigation(
    carousel
  );

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

      renderCardOffset(
        card,
        index-activeIndex
      );
    }
  );
}
