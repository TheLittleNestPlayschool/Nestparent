import{createMemoriesCard}from"./parent_memories_card.js";
import{
  pushStageCard,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";
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

/*   open memories stage*/
export function openMemoriesStage({carousel,nestCard}){
  if(
    memoriesOpen||
    !carousel||
    !nestCard||
    isStageMotionLocked()
  ){
    return;
  }

  const newMemoriesCard=createMemoriesCard({
    onChapter:handleMemoryChapter,
    onCollection:handleMemoryCollection
  });

  newMemoriesCard.addEventListener("click",handleMemoriesCardBack);
  nestCard.addEventListener("click",handleNestCardBack);
  carousel.appendChild(newMemoriesCard);

  const pushed=pushStageCard(newMemoriesCard);
  if(!pushed){
    newMemoriesCard.removeEventListener("click",handleMemoriesCardBack);
    nestCard.removeEventListener("click",handleNestCardBack);
    newMemoriesCard.remove();
    return;
  }

  memoriesCard=newMemoriesCard;
  currentNestCard=nestCard;
  currentCarousel=carousel;
  memoriesOpen=true;
}

/*   open collection*/
function openCollection(collection){
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
function handleMemoryChapter(chapter){
  if(chapter==="today"){
    openCollection("today");
    return true;
  }

  if(chapter==="week"){
    openCollection("week");
    return true;
  }

  if(chapter==="august"||chapter==="month"){
    openCollection("month");
    return true;
  }

  return false;
}

/*   handle special collection*/
function handleMemoryCollection(collection){
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
function handleCollectionMedia(payload){
  const collectionCard=getMemoryCollectionCard();
  if(!collectionCard){return false;}

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
  if(!isMemoryViewerStageOpen()){return;}

  closeMemoryViewerStage({
    nestCard:currentNestCard,
    memoriesCard,
    collectionCard:getMemoryCollectionCard()
  });
}

/*   memories card back*/
function handleMemoriesCardBack(event){
  if(
    !memoriesCard||
    !memoriesCard.classList.contains("is-stage-back")||
    isMemoryViewerStageOpen()
  ){
    return;
  }

  event.stopPropagation();

  if(isMemoryCollectionStageOpen()){
    closeMemoryCollectionStage({
      nestCard:currentNestCard,
      memoriesCard
    });
  }
}

/*   nest card back*/
function handleNestCardBack(event){
  if(
    !memoriesOpen||
    !currentNestCard?.classList.contains("is-stage-back")||
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
  if(!memoriesOpen||isStageMotionLocked()){return;}

  if(isMemoryViewerStageOpen()){
    closeMemoryViewerStage({
      nestCard:currentNestCard,
      memoriesCard,
      collectionCard:getMemoryCollectionCard()
    });
    return;
  }

  if(isMemoryCollectionStageOpen()){
    closeMemoryCollectionStage({
      nestCard:currentNestCard,
      memoriesCard
    });
    return;
  }

  const closingCard=memoriesCard;
  const closed=popStageCard(closingCard);
  if(!closed){return;}

  closingCard?.removeEventListener("click",handleMemoriesCardBack);
  currentNestCard?.removeEventListener("click",handleNestCardBack);

  memoriesCard=null;
  currentNestCard=null;
  currentCarousel=null;
  memoriesOpen=false;
}

/*   stage state*/
export function isMemoriesStageOpen(){return memoriesOpen;}
export{isMemoryCollectionStageOpen};
export{isMemoryViewerStageOpen};
