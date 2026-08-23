import {
  createMemoriesCard
} from "./parent_memories_card.js";


import {
  renderCardOffset
} from "./parent_card_positions.js";


let memoriesOpen =
  false;


let memoriesCard =
  null;


let currentNestCard =
  null;


let closeTimer =
  null;


/*   open memories stage*/

export function openMemoriesStage({
  carousel,
  nestCard
}){

  if(
    memoriesOpen
    ||
    !carousel
    ||
    !nestCard
  ){
    return;
  }


  if(
    closeTimer
  ){

    clearTimeout(
      closeTimer
    );


    closeTimer =
      null;

  }


  memoriesOpen =
    true;


  currentNestCard =
    nestCard;


  memoriesCard =
    createMemoriesCard();


  carousel.appendChild(
    memoriesCard
  );


  void memoriesCard.offsetWidth;


  /*   move nest card to previous position*/

  renderCardOffset(
    nestCard,
    1
  );


  nestCard.classList.add(
    "is-stage-back"
  );


  nestCard.style.pointerEvents =
    "auto";


  /*   tapping previous card returns one level*/

  nestCard.addEventListener(
    "click",
    handleNestCardBack
  );


  /*   bring memories into center*/

  requestAnimationFrame(
    ()=>{

      requestAnimationFrame(
        ()=>{

          if(
            !memoriesCard
          ){
            return;
          }


          memoriesCard.classList.add(
            "is-visible"
          );

        }
      );

    }
  );

}


/*   previous card tap*/

function handleNestCardBack(
  event
){

  event.stopPropagation();


  closeMemoriesStage({
    nestCard:
      currentNestCard
  });

}


/*   close memories stage*/

export function closeMemoriesStage({
  nestCard
} = {}){

  if(
    !memoriesOpen
  ){
    return;
  }


  memoriesOpen =
    false;


  const cardToRemove =
    memoriesCard;


  const previousNestCard =
    nestCard
    ||
    currentNestCard;


  /*   memories begins leaving first*/

  if(
    cardToRemove
  ){

    cardToRemove.classList.remove(
      "is-visible"
    );


    cardToRemove.classList.add(
      "is-leaving"
    );

  }


  /*   disable previous-card behavior while returning*/

  if(
    previousNestCard
  ){

    previousNestCard.removeEventListener(
      "click",
      handleNestCardBack
    );


    previousNestCard.style.pointerEvents =
      "none";

  }


  /*
    Give Memories a small head start.

    Then let the Nest card begin its
    relaxed glide back into the center.
  */

  closeTimer =
    window.setTimeout(
      ()=>{

        closeTimer =
          null;


        if(
          previousNestCard
        ){

          previousNestCard.classList.remove(
            "is-stage-back"
          );


          renderCardOffset(
            previousNestCard,
            0
          );


          previousNestCard.style.pointerEvents =
            "auto";

        }

      },
      220
    );


  /*
    Memories stays above the returning
    Nest card while fading, then leaves
    the stage once it is no longer useful.
  */

  window.setTimeout(
    ()=>{

      if(
        cardToRemove
        &&
        cardToRemove.parentNode
      ){

        cardToRemove.remove();

      }

    },
    1450
  );


  memoriesCard =
    null;


  currentNestCard =
    null;

}


/*   memories state*/

export function isMemoriesStageOpen(){

  return memoriesOpen;

}
