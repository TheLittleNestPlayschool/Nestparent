import{createMemoryArchiveCard}from"./parent_memory_archive.js";
import{
  pushStageCard,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";

let archiveOpen=false;
let archiveCard=null;
let currentMemoriesCard=null;

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

  const newArchiveCard=createMemoryArchiveCard();
  memoriesCard.addEventListener("click",handleMemoriesBack);
  carousel.appendChild(newArchiveCard);

  const pushed=pushStageCard(newArchiveCard);
  if(!pushed){
    memoriesCard.removeEventListener("click",handleMemoriesBack);
    newArchiveCard.remove();
    return;
  }

  archiveCard=newArchiveCard;
  currentMemoriesCard=memoriesCard;
  archiveOpen=true;
}

/*   previous memories card*/
function handleMemoriesBack(event){
  if(
    !currentMemoriesCard?.classList.contains("is-stage-back")
  ){
    return;
  }

  event.stopPropagation();
  closeMemoryArchiveStage();
}

/*   close archive stage*/
export function closeMemoryArchiveStage(){
  if(
    !archiveOpen||
    !archiveCard||
    isStageMotionLocked()
  ){
    return;
  }

  const closingCard=archiveCard;
  const previousMemoriesCard=currentMemoriesCard;
  const closed=popStageCard(closingCard);
  if(!closed){return;}

  previousMemoriesCard?.removeEventListener("click",handleMemoriesBack);

  archiveCard=null;
  currentMemoriesCard=null;
  archiveOpen=false;
}

/*   archive state*/
export function isMemoryArchiveOpen(){return archiveOpen;}

/*   current archive card*/
export function getMemoryArchiveCard(){return archiveCard;}
