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


  memoriesCard =
    createMemoriesCard();


  carousel.appendChild(
    memoriesCard
  );


  void memoriesCard.offsetWidth;


  /*   move nest card to the right*/

  renderCardOffset(
    nestCard,
    1
  );


  /*   bring memories card into center*/

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


/*   close memories stage*/

export function closeMemoriesStage({
  nestCard
}){

  if(
    !memoriesOpen
  ){
    return;
  }


  memoriesOpen =
    false;


  if(
    memoriesCard
  ){

    memoriesCard.classList.remove(
      "is-visible"
    );

  }


  if(
    nestCard
  ){

    renderCardOffset(
      nestCard,
      0
    );

  }


  const cardToRemove =
    memoriesCard;


  memoriesCard =
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
