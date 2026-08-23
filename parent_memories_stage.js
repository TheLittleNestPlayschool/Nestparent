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


  const previousNestCard =
    nestCard
    ||
    currentNestCard;


  if(
    memoriesCard
  ){

    memoriesCard.classList.remove(
      "is-visible"
    );

  }


  if(
    previousNestCard
  ){

    previousNestCard.classList.remove(
      "is-stage-back"
    );


    previousNestCard.removeEventListener(
      "click",
      handleNestCardBack
    );


    renderCardOffset(
      previousNestCard,
      0
    );


    previousNestCard.style.pointerEvents =
      "auto";

  }


  const cardToRemove =
    memoriesCard;


  memoriesCard =
    null;


  currentNestCard =
    null;


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
    1500
  );

}


/*   memories state*/

export function isMemoriesStageOpen(){

  return memoriesOpen;

}
