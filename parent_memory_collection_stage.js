import{createMemoryCollectionCard}from"./parent_memory_collection_card.js";
import{
  pushStageCard,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";

let collectionOpen=false;
let collectionCard=null;

/*   open memory collection stage*/
export function openMemoryCollectionStage({
  carousel,
  memoriesCard,
  collection="today",
  onMedia,
  onBack
}){
  if(
    collectionOpen||
    !carousel||
    !memoriesCard||
    isStageMotionLocked()
  ){
    return false;
  }

  const newCollectionCard=createMemoryCollectionCard(
    collection,
    {onMedia}
  );

  if(typeof onBack==="function"){
    newCollectionCard.addEventListener("click",event=>{
      if(
        !newCollectionCard.classList.contains("is-stage-back")
      ){
        return;
      }

      event.stopPropagation();
      onBack();
    });
  }

  carousel.appendChild(newCollectionCard);

  const pushed=pushStageCard(newCollectionCard);
  if(!pushed){
    newCollectionCard.remove();
    return false;
  }

  collectionCard=newCollectionCard;
  collectionOpen=true;
  return true;
}

/*   close memory collection stage*/
export function closeMemoryCollectionStage(){
  if(
    !collectionOpen||
    !collectionCard||
    isStageMotionLocked()
  ){
    return false;
  }

  const closingCard=collectionCard;
  const closed=popStageCard(closingCard);
  if(!closed){return false;}

  collectionCard=null;
  collectionOpen=false;
  return true;
}

/*   get collection card*/
export function getMemoryCollectionCard(){return collectionCard;}

/*   collection stage open*/
export function isMemoryCollectionStageOpen(){return collectionOpen;}
