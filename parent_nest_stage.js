import {
  createNestCard
} from "./parent_nest_card.js";


import {
  renderCardPositions
} from "./parent_card_positions.js";


let nestOpen =
  false;


let nestCard =
  null;


let mainBackCard =
  null;


let returnTimer =
  null;


/*   get main back card*/

function getMainBackCard(
  carousel,
  activeIndex
){

  if(
    !carousel
  ){
    return null;
  }


  return carousel.querySelector(
    `.experience:not(.nest-experience)[data-index="${activeIndex}"]`
  );

}


/*   activate main back card*/

function activateMainBackCard(
  carousel,
  activeIndex
){

  mainBackCard =
    getMainBackCard(
      carousel,
      activeIndex
    );


  if(
    !mainBackCard
  ){
    return;
  }


  mainBackCard.classList.add(
    "is-stage-back"
  );


  mainBackCard.style.pointerEvents =
    "auto";


  mainBackCard.addEventListener(
    "click",
    handleMainBackCard
  );

}


/*   deactivate main back card*/

function deactivateMainBackCard(){

  if(
    !mainBackCard
  ){
    return;
  }


  mainBackCard.classList.remove(
    "is-stage-back"
  );


  mainBackCard.removeEventListener(
    "click",
    handleMainBackCard
  );


  mainBackCard.style.pointerEvents =
    "none";

}


/*   main card back*/

function handleMainBackCard(
  event
){

  event.stopPropagation();


  window.dispatchEvent(
    new CustomEvent(
      "parent:return-main-stage"
    )
  );

}


/*   open nest stage*/

export function openNestStage({
  carousel,
  activeIndex,
  hideHint
}){

  if(
    nestOpen
    ||
    nestCard
    ||
    !carousel
  ){
    return;
  }


  if(
    returnTimer
  ){

    clearTimeout(
      returnTimer
    );


    returnTimer =
      null;

  }


  nestOpen =
    true;


  if(
    typeof hideHint ===
    "function"
  ){

    hideHint();

  }


  nestCard =
    createNestCard();


  carousel.appendChild(
    nestCard
  );


  void nestCard.offsetWidth;


  /*   move current card right*/

  renderCardPositions({
    carousel,
    activeIndex,
    nestOpen:true
  });


  /*   right card becomes back target*/

  activateMainBackCard(
    carousel,
    activeIndex
  );


  /*   reveal nest*/

  requestAnimationFrame(
    ()=>{

      requestAnimationFrame(
        ()=>{

          if(
            !nestCard
          ){
            return;
          }


          nestCard.classList.add(
            "is-visible"
          );

        }
      );

    }
  );

}


/*   close nest stage*/

export function closeNestStage({
  carousel,
  activeIndex
}){

  if(
    !nestOpen
    ||
    !carousel
  ){
    return;
  }


  nestOpen =
    false;


  const cardToRemove =
    nestCard;


  const returningCard =
    mainBackCard
    ||
    getMainBackCard(
      carousel,
      activeIndex
    );


  /*   stop back interaction*/

  deactivateMainBackCard();


  /*
    Nest remains underneath.

    Mia is promoted above it before
    she begins moving toward center.
  */

  if(
    returningCard
  ){

    returningCard.classList.add(
      "is-returning-front"
    );


    returningCard.style.pointerEvents =
      "none";

  }


  /*
    Nest begins fading underneath
    the returning Mia card.
  */

  if(
    cardToRemove
  ){

    cardToRemove.classList.remove(
      "is-visible"
    );


    cardToRemove.classList.add(
      "is-leaving-under"
    );


    cardToRemove.style.pointerEvents =
      "none";

  }


  /*
    Small overlap only.

    Mia begins travelling over the
    fading Nest almost immediately.
  */

  returnTimer =
    window.setTimeout(
      ()=>{

        returnTimer =
          null;


        renderCardPositions({
          carousel,
          activeIndex,
          nestOpen:false
        });

      },
      110
    );


  /*
    Nest can disappear once its fade
    underneath Mia has completed.
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


      if(
        nestCard ===
        cardToRemove
      ){

        nestCard =
          null;

      }

    },
    1050
  );


  /*
    Mia keeps the foreground stacking
    until her relaxed glide completes.
  */

  window.setTimeout(
    ()=>{

      if(
        returningCard
      ){

        returningCard.classList.remove(
          "is-returning-front"
        );


        returningCard.style.pointerEvents =
          "auto";

      }


      if(
        mainBackCard ===
        returningCard
      ){

        mainBackCard =
          null;

      }

    },
    1700
  );

}


/*   nest state*/

export function isNestStageOpen(){

  return nestOpen;

}


/*   current nest card*/

export function getNestCard(){

  return nestCard;

}
