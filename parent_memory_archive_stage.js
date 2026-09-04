import{createMemoryArchiveCard}from"./parent_memory_archive.js";
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

let archiveOpen=false;
let archiveCard=null;
let currentMemoriesCard=null;
let currentCarousel=null;

/*   open archive stage*/
export function openMemoryArchiveStage({carousel,memoriesCard}){
  if(
    archiveOpen||
    !carousel||
    !memoriesCard||
    isStageMotionLocked()
  ){
    return;
  }

  const newArchiveCard=createMemoryArchiveCard({
    onArchive:handleArchiveMonth
  });

  memoriesCard.addEventListener("click",handleMemoriesBack);
  newArchiveCard.addEventListener("click",handleArchiveBack);
  carousel.appendChild(newArchiveCard);

  const pushed=pushStageCard(newArchiveCard);
  if(!pushed){
    memoriesCard.removeEventListener("click",handleMemoriesBack);
    newArchiveCard.removeEventListener("click",handleArchiveBack);
    newArchiveCard.remove();
    return;
  }

  archiveCard=newArchiveCard;
  currentMemoriesCard=memoriesCard;
  currentCarousel=carousel;
  archiveOpen=true;
}

/*   open archive month*/
function handleArchiveMonth(payload){
  if(
    !archiveOpen||
    !archiveCard||
    !currentCarousel||
    isMemoryCollectionStageOpen()||
    isStageMotionLocked()
  ){
    return false;
  }

  return openMemoryCollectionStage({
    carousel:currentCarousel,
    memoriesCard:archiveCard,
    collection:{
      type:"archive-month",
      year:payload.year,
      month:payload.month
    },
    onMedia:handleArchiveMedia,
    onBack:handleCollectionBack
  });
}

/*   open archive media*/
function handleArchiveMedia(payload){
  const collectionCard=getMemoryCollectionCard();
  if(!collectionCard)return false;

  return openMemoryViewerStage({
    carousel:currentCarousel,
    collectionCard,
    mediaItems:payload.mediaItems,
    index:payload.index,
    collection:payload.collection
  });
}

/*   collection back from viewer*/
function handleCollectionBack(){
  if(!isMemoryViewerStageOpen())return;
  closeMemoryViewerStage();
}

/*   archive back from month*/
function handleArchiveBack(event){
  if(
    !archiveOpen||
    !archiveCard?.classList.contains("is-stage-back")||
    !isMemoryCollectionStageOpen()||
    isMemoryViewerStageOpen()
  ){
    return;
  }

  event.stopPropagation();
  closeMemoryCollectionStage();
}

/*   previous memories card*/
function handleMemoriesBack(event){
  if(
    !currentMemoriesCard?.classList.contains("is-stage-back")||
    isMemoryCollectionStageOpen()||
    isMemoryViewerStageOpen()
  ){
    return;
  }

  event.stopPropagation();
  closeMemoryArchiveStage();
}

/*   close archive stage*/
export function closeMemoryArchiveStage(){
  if(!archiveOpen||isStageMotionLocked())return;

  if(isMemoryViewerStageOpen()){
    closeMemoryViewerStage();
    return;
  }

  if(isMemoryCollectionStageOpen()){
    closeMemoryCollectionStage();
    return;
  }

  if(!archiveCard)return;

  const closingCard=archiveCard;
  const previousMemoriesCard=currentMemoriesCard;
  const closed=popStageCard(closingCard);
  if(!closed)return;

  previousMemoriesCard?.removeEventListener("click",handleMemoriesBack);
  closingCard.removeEventListener("click",handleArchiveBack);

  archiveCard=null;
  currentMemoriesCard=null;
  currentCarousel=null;
  archiveOpen=false;
}

/*   archive state*/
export function isMemoryArchiveOpen(){return archiveOpen;}

/*   current archive card*/
export function getMemoryArchiveCard(){return archiveCard;}
