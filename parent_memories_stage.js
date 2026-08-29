import{
  createMemoriesCard
}from"./parent_memories_card.js";

import{
  renderCardOffset
}from"./parent_card_positions.js";

import{
  openMemoryCollectionStage,
  closeMemoryCollectionStage,
  getMemoryCollectionCard,
  isMemoryCollectionStageOpen
}from"./parent_memory_collection_stage.js";

import{
  openMemoryViewerStage,
  closeMemoryViewerStage,
  isMemoryViewerStageOpen
}from"./parent_memory_viewer_stage.js";

let memoriesOpen=false;
let memoriesCard=null;
let currentNestCard=null;
let currentCarousel=null;
let closeTimer=null;

/*   open memories stage*/
export function openMemoriesStage({
  carousel,
  nestCard
}){
  if(
    memoriesOpen||
    !carousel||
    !nestCard
  ){
    return;
  }

  if(closeTimer){
    clearTimeout(closeTimer);
    closeTimer=null;
  }

  memoriesOpen=true;
  currentCarousel=carousel;
  currentNestCard=nestCard;

  memoriesCard=
    createMemoriesCard({
      onChapter:handleMemoryChapter,
      onCollection:handleMemoryCollection
    });

  memoriesCard.addEventListener(
    "click",
    handleMemoriesCardBack
  );

  currentNestCard.addEventListener(
    "click",
    handleNestCardBack
  );

  carousel.appendChild(
    memoriesCard
  );

  void memoriesCard.offsetWidth;

  /*   nest becomes previous level*/
  currentNestCard.classList.add(
    "is-stage-back"
  );

  renderCardOffset(
    currentNestCard,
    1
  );

  currentNestCard.style.pointerEvents=
    "auto";

  /*   memories enters*/
  renderCardOffset(
    memoriesCard,
    0
  );

  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      memoriesCard.classList.add(
        "is-visible"
      );
    });
  });
}

/*   open collection*/
function openCollection(
  collection
){
  return openMemoryCollectionStage({
    carousel:currentCarousel,
    nestCard:currentNestCard,
    memoriesCard,
    collection,
    onMedia:handleCollectionMedia,
    onBack:handleCollectionCardBack
  });
}

/*   handle memory chapter*/
function handleMemoryChapter(
  chapter
){
  if(chapter==="today"){
    openCollection("today");
    return true;
  }

  if(chapter==="week"){
    openCollection("week");
    return true;
  }

  if(chapter==="august"){
    openCollection("month");
    return true;
  }

  return false;
}

/*   handle special collection*/
function handleMemoryCollection(
  collection
){
  if(collection==="recognition"){
    openCollection("recognition");
    return true;
  }

  if(collection==="birthday"){
    openCollection("birthday");
    return true;
  }

  return false;
}

/*   collection media*/
function handleCollectionMedia(
  payload
){
  const collectionCard=
    getMemoryCollectionCard();

  if(!collectionCard){
    return false;
  }

  openMemoryViewerStage({
    carousel:currentCarousel,
    nestCard:currentNestCard,
    memoriesCard,
    collectionCard,
    mediaItems:payload.mediaItems,
    index:payload.index,
    collection:payload.collection
  });

  return true;
}

/*   collection card back*/
function handleCollectionCardBack(){
  if(
    !isMemoryViewerStageOpen()
  ){
    return;
  }

  closeMemoryViewerStage({
    nestCard:currentNestCard,
    memoriesCard,
    collectionCard:
      getMemoryCollectionCard()
  });
}

/*   memories card back*/
function handleMemoriesCardBack(
  event
){
  if(
    !memoriesCard||
    !memoriesCard.classList.contains(
      "is-stage-back"
    )
  ){
    return;
  }

  event.stopPropagation();

  if(
    isMemoryViewerStageOpen()
  ){
    return;
  }

  if(
    isMemoryCollectionStageOpen()
  ){
    closeMemoryCollectionStage({
      nestCard:currentNestCard,
      memoriesCard
    });

    return;
  }
}

/*   nest card back*/
function handleNestCardBack(
  event
){
  if(
    !memoriesOpen||
    isMemoryCollectionStageOpen()||
    isMemoryViewerStageOpen()
  ){
    return;
  }

  event.stopPropagation();

  closeMemoriesStage();
}

/*   close memories stage*/
export function closeMemoriesStage(){
  if(!memoriesOpen){
    return;
  }

  if(
    isMemoryViewerStageOpen()
  ){
    closeMemoryViewerStage({
      nestCard:currentNestCard,
      memoriesCard,
      collectionCard:
        getMemoryCollectionCard()
    });

    return;
  }

  if(
    isMemoryCollectionStageOpen()
  ){
    closeMemoryCollectionStage({
      nestCard:currentNestCard,
      memoriesCard
    });

    return;
  }

  memoriesOpen=false;

  const cardToRemove=
    memoriesCard;

  const returningNestCard=
    currentNestCard;

  memoriesCard=null;

  if(cardToRemove){
    cardToRemove.classList.remove(
      "is-visible"
    );

    cardToRemove.classList.add(
      "is-leaving"
    );
  }

  if(returningNestCard){
    returningNestCard.removeEventListener(
      "click",
      handleNestCardBack
    );

    returningNestCard.classList.remove(
      "is-stage-back"
    );

    renderCardOffset(
      returningNestCard,
      0
    );

    returningNestCard.style.pointerEvents=
      "auto";
  }

  closeTimer=
    window.setTimeout(()=>{
      if(cardToRemove){
        cardToRemove.remove();
      }

      closeTimer=null;
    },700);

  currentNestCard=null;
  currentCarousel=null;
}

/*   memories stage open*/
export function isMemoriesStageOpen(){
  return memoriesOpen;
}

/*   collection stage open*/
export{
  isMemoryCollectionStageOpen
};

/*   viewer stage open*/
export{
  isMemoryViewerStageOpen
};
