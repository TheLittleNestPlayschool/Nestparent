import{createMemoryViewerCard}from"./parent_memory_viewer_card.js";
import{
  pushStageCard,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";

let viewerOpen=false;
let viewerCard=null;

/*   open memory viewer stage*/
export function openMemoryViewerStage({
  carousel,
  collectionCard,
  mediaItems,
  index,
  collection
}){
  if(
    viewerOpen||
    !carousel||
    !collectionCard||
    isStageMotionLocked()
  ){
    return false;
  }

  const newViewerCard=createMemoryViewerCard({
    mediaItems,
    activeIndex:index,
    collection
  });

  carousel.appendChild(newViewerCard);

  const pushed=pushStageCard(newViewerCard);
  if(!pushed){
    newViewerCard.remove();
    return false;
  }

  viewerCard=newViewerCard;
  viewerOpen=true;
  return true;
}

/*   close memory viewer stage*/
export function closeMemoryViewerStage(){
  if(
    !viewerOpen||
    !viewerCard||
    isStageMotionLocked()
  ){
    return false;
  }

  const closingCard=viewerCard;
  const closed=popStageCard(closingCard);
  if(!closed){return false;}

  viewerCard=null;
  viewerOpen=false;
  return true;
}

/*   viewer stage open*/
export function isMemoryViewerStageOpen(){return viewerOpen;}
