import{
  createMemoryCollectionCard
}from"./parent_memory_collection_card.js";

import{
  renderCardOffset
}from"./parent_card_positions.js";

let collectionOpen=false;
let collectionCard=null;
let collectionCloseTimer=null;

/*   open memory collection stage*/
export function openMemoryCollectionStage({
  carousel,
  nestCard,
  memoriesCard,
  collection="today",
  onMedia,
  onBack
}){
  if(
    collectionOpen||
    !carousel||
    !memoriesCard
  ){
    return false;
  }

  if(collectionCloseTimer){
    clearTimeout(
      collectionCloseTimer
    );

    collectionCloseTimer=null;
  }

  collectionOpen=true;

  collectionCard=
    createMemoryCollectionCard(
      collection,
      {
        onMedia
      }
    );

  if(
    typeof onBack===
    "function"
  ){
    collectionCard.addEventListener(
      "click",
      event=>{
        if(
          !collectionCard||
          !collectionCard.classList.contains(
            "is-stage-back"
          )
        ){
          return;
        }

        event.stopPropagation();

        onBack();
      }
    );
  }

  carousel.appendChild(
    collectionCard
  );

  void collectionCard.offsetWidth;

  /*   nest moves further back*/
  if(nestCard){
    nestCard.classList.remove(
      "is-stage-back"
    );

    renderCardOffset(
      nestCard,
      2
    );

    nestCard.style.pointerEvents=
      "none";
  }

  /*   memories becomes previous level*/
  memoriesCard.classList.add(
    "is-stage-back"
  );

  renderCardOffset(
    memoriesCard,
    1
  );

  memoriesCard.style.pointerEvents=
    "auto";

  /*   collection enters*/
  renderCardOffset(
    collectionCard,
    0
  );

  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      if(!collectionCard){
        return;
      }

      collectionCard.classList.add(
        "is-visible"
      );
    });
  });

  return true;
}

/*   close memory collection stage*/
export function closeMemoryCollectionStage({
  nestCard,
  memoriesCard
}={}){
  if(!collectionOpen){
    return false;
  }

  collectionOpen=false;

  const cardToRemove=
    collectionCard;

  const returningMemoriesCard=
    memoriesCard;

  collectionCard=null;

  /*   outgoing collection fades underneath*/
  if(cardToRemove){
    cardToRemove.classList.remove(
      "is-visible"
    );

    cardToRemove.classList.add(
      "is-leaving"
    );

    cardToRemove.style.pointerEvents=
      "none";
  }

  /*   memories becomes foreground return card*/
  if(returningMemoriesCard){
    returningMemoriesCard.classList.remove(
      "is-stage-back"
    );

    returningMemoriesCard.classList.add(
      "is-returning-front"
    );

    returningMemoriesCard.style.pointerEvents=
      "none";
  }

  /*   nest becomes previous level*/
  if(nestCard){
    nestCard.classList.add(
      "is-stage-back"
    );

    renderCardOffset(
      nestCard,
      1
    );

    nestCard.style.pointerEvents=
      "auto";
  }

  /*   begin memories return glide*/
  collectionCloseTimer=
    window.setTimeout(
      ()=>{
        collectionCloseTimer=null;

        if(returningMemoriesCard){
          renderCardOffset(
            returningMemoriesCard,
            0
          );
        }
      },
      110
    );

  /*   remove outgoing collection*/
  window.setTimeout(
    ()=>{
      if(
        cardToRemove&&
        cardToRemove.parentNode
      ){
        cardToRemove.remove();
      }
    },
    1050
  );

  /*   release memories after glide*/
  window.setTimeout(
    ()=>{
      if(!returningMemoriesCard){
        return;
      }

      returningMemoriesCard.classList.remove(
        "is-returning-front"
      );

      returningMemoriesCard.style.pointerEvents=
        "auto";
    },
    1700
  );

  return true;
}

/*   get collection card*/
export function getMemoryCollectionCard(){
  return collectionCard;
}

/*   collection stage open*/
export function isMemoryCollectionStageOpen(){
  return collectionOpen;
}
