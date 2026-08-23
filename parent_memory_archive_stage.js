import {
  createMemoryArchiveCard
} from "./parent_memory_archive.js";


import {
  renderCardOffset
} from "./parent_card_positions.js";


let archiveOpen =
  false;


let archiveCard =
  null;


let currentMemoriesCard =
  null;


/*   open archive stage*/

export function openMemoryArchiveStage({
  carousel,
  memoriesCard
}){

  if(
    archiveOpen
    ||
    !carousel
    ||
    !memoriesCard
  ){
    return;
  }


  archiveOpen =
    true;


  currentMemoriesCard =
    memoriesCard;


  archiveCard =
    createMemoryArchiveCard();


  carousel.appendChild(
    archiveCard
  );


  void archiveCard.offsetWidth;


  /*   move memories card to previous position*/

  renderCardOffset(
    memoriesCard,
    1
  );


  memoriesCard.classList.add(
    "is-stage-back"
  );


  memoriesCard.style.pointerEvents =
    "auto";


  memoriesCard.addEventListener(
    "click",
    handleMemoriesBack
  );


  /*   bring archive card into center*/

  requestAnimationFrame(
    ()=>{

      requestAnimationFrame(
        ()=>{

          if(
            !archiveCard
          ){
            return;
          }


          archiveCard.classList.add(
            "is-visible"
          );

        }
      );

    }
  );

}


/*   previous memories card*/

function handleMemoriesBack(
  event
){

  event.stopPropagation();


  closeMemoryArchiveStage({
    memoriesCard:
      currentMemoriesCard
  });

}


/*   close archive stage*/

export function closeMemoryArchiveStage({
  memoriesCard
} = {}){

  if(
    !archiveOpen
  ){
    return;
  }


  archiveOpen =
    false;


  const cardToRemove =
    archiveCard;


  const previousMemoriesCard =
    memoriesCard
    ||
    currentMemoriesCard;


  /*   archive fades underneath*/

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


  /*   memories becomes foreground return card*/

  if(
    previousMemoriesCard
  ){

    previousMemoriesCard.removeEventListener(
      "click",
      handleMemoriesBack
    );


    previousMemoriesCard.classList.remove(
      "is-stage-back"
    );


    previousMemoriesCard.classList.add(
      "is-returning-front"
    );


    previousMemoriesCard.style.pointerEvents =
      "none";

  }


  /*   return memories over archive*/

  window.setTimeout(
    ()=>{

      if(
        previousMemoriesCard
      ){

        renderCardOffset(
          previousMemoriesCard,
          0
        );

      }

    },
    110
  );


  /*   remove archive*/

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
    1050
  );


  /*   release foreground state*/

  window.setTimeout(
    ()=>{

      if(
        previousMemoriesCard
      ){

        previousMemoriesCard.classList.remove(
          "is-returning-front"
        );


        previousMemoriesCard.style.pointerEvents =
          "auto";

      }

    },
    1700
  );


  archiveCard =
    null;


  currentMemoriesCard =
    null;

}


/*   archive state*/

export function isMemoryArchiveOpen(){

  return archiveOpen;

}


/*   current archive card*/

export function getMemoryArchiveCard(){

  return archiveCard;

}
