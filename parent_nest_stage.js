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


let returnTimer =
  null;


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


  /*   move current Mia card to the right*/

  renderCardPositions({
    carousel,
    activeIndex,
    nestOpen:true
  });


  /*   bring Nest card into center*/

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


  /*   Nest begins leaving first*/

  if(
    cardToRemove
  ){

    cardToRemove.classList.remove(
      "is-visible"
    );


    cardToRemove.classList.add(
      "is-leaving"
    );


    cardToRemove.style.pointerEvents =
      "none";

  }


  /*
    Give the Nest card a small head start.

    Mia then begins her relaxed glide
    back toward the center.
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
      220
    );


  /*
    Keep the outgoing Nest card alive
    long enough to finish its exit.
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
    1450
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
