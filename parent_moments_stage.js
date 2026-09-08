import{createMomentsCard}from"./parent_moments_card.js";
import{
  beginStageMotion,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";

let momentsOpen=false;
let momentsCard=null;
let currentMainCard=null;

/*   open moments stage*/
export function openMomentsStage({carousel,activeIndex,item,mainCard}){
  if(momentsOpen||!carousel||!item||!mainCard||isStageMotionLocked()){
    return false;
  }

  const newMomentsCard=createMomentsCard(item);
  newMomentsCard.addEventListener("click",handleMomentsCardClick);
  mainCard.addEventListener("click",handleMainCardBack);
  carousel.appendChild(newMomentsCard);

  const opened=beginStageMotion({carousel,activeIndex,card:newMomentsCard});
  if(!opened){
    newMomentsCard.removeEventListener("click",handleMomentsCardClick);
    mainCard.removeEventListener("click",handleMainCardBack);
    newMomentsCard.remove();
    return false;
  }

  momentsCard=newMomentsCard;
  currentMainCard=mainCard;
  momentsOpen=true;
  return true;
}

function handleMomentsCardClick(event){
  event.stopPropagation();
}

function handleMainCardBack(event){
  if(!momentsOpen||!currentMainCard?.classList.contains("is-stage-back")||isStageMotionLocked()){
    return;
  }
  event.stopPropagation();
  closeMomentsStage();
}

/*   close moments stage*/
export function closeMomentsStage(){
  if(!momentsOpen||!momentsCard||isStageMotionLocked()){
    return false;
  }

  const closingCard=momentsCard;
  const closed=popStageCard(closingCard);
  if(!closed){return false;}

  closingCard.removeEventListener("click",handleMomentsCardClick);
  currentMainCard?.removeEventListener("click",handleMainCardBack);
  momentsCard=null;
  currentMainCard=null;
  momentsOpen=false;
  return true;
}

export function isMomentsStageOpen(){
  return momentsOpen;
}
