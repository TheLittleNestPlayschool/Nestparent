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


/*   open nest stage*/

export function openNestStage({
  carousel,
  activeIndex,
  hideHint
}){

  if(
    nestOpen
    ||
    !carousel
  ){
    return;
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


  renderCardPositions({
    carousel,
    activeIndex,
    nestOpen:true
  });


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
  ){
    return;
  }


  nestOpen =
    false;


  if(
    nestCard
  ){

    nestCard.classList.remove(
      "is-visible"
    );

  }


  renderCardPositions({
    carousel,
    activeIndex,
    nestOpen:false
  });


  const cardToRemove =
    nestCard;


  nestCard =
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


/*   nest state*/

export function isNestStageOpen(){

  return nestOpen;

}


/*   current nest card*/

export function getNestCard(){

  return nestCard;

}
