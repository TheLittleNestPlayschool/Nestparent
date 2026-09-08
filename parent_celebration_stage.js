import{createCelebrationCard}from"./parent_celebration_card.js";
import{
  beginStageMotion,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";

let celebrationOpen=false;
let celebrationCard=null;
let currentMainCard=null;

export function openCelebrationStage({carousel,activeIndex,item,mainCard}){
  if(celebrationOpen||!carousel||!item||!mainCard||isStageMotionLocked()){
    return false;
  }

  const newCelebrationCard=createCelebrationCard(item);
  newCelebrationCard.addEventListener("click",handleCelebrationCardClick);
  mainCard.addEventListener("click",handleMainCardBack);
  carousel.appendChild(newCelebrationCard);

  const opened=beginStageMotion({carousel,activeIndex,card:newCelebrationCard});
  if(!opened){
    newCelebrationCard.removeEventListener("click",handleCelebrationCardClick);
    mainCard.removeEventListener("click",handleMainCardBack);
    newCelebrationCard.remove();
    return false;
  }

  celebrationCard=newCelebrationCard;
  currentMainCard=mainCard;
  celebrationOpen=true;
  return true;
}

function handleCelebrationCardClick(event){
  event.stopPropagation();
}

function handleMainCardBack(event){
  if(!celebrationOpen||!currentMainCard?.classList.contains("is-stage-back")||isStageMotionLocked()){
    return;
  }
  event.stopPropagation();
  closeCelebrationStage();
}

export function closeCelebrationStage(){
  if(!celebrationOpen||!celebrationCard||isStageMotionLocked()){
    return false;
  }

  const closingCard=celebrationCard;
  const closed=popStageCard(closingCard);
  if(!closed){return false;}

  closingCard.removeEventListener("click",handleCelebrationCardClick);
  currentMainCard?.removeEventListener("click",handleMainCardBack);
  celebrationCard=null;
  currentMainCard=null;
  celebrationOpen=false;
  return true;
}

export function isCelebrationStageOpen(){
  return celebrationOpen;
}
