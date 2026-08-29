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

  requestAnimationFrame(
    ()=>{
      requestAnimationFrame(
        ()=>{
          collectionCard.classList.add(
            "is-visible"
          );
        }
      );
    }
  );

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

  collectionCard=null;

  if(cardToRemove){
    cardToRemove.classList.remove(
      "is-visible"
    );

    cardToRemove.classList.add(
      "is-leaving"
    );
  }

  /*   memories returns to center*/
  if(memoriesCard){
    memoriesCard.classList.remove(
      "is-stage-back"
    );

    renderCardOffset(
      memoriesCard,
      0
    );

    memoriesCard.style.pointerEvents=
      "auto";
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

  collectionCloseTimer=
    window.setTimeout(
      ()=>{
        if(cardToRemove){
          cardToRemove.remove();
        }

        collectionCloseTimer=null;
      },
      700
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
