import{createActivityCard}from"./parent_activity_card.js";
import{
  beginStageMotion,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";

let activityOpen=false;
let activityCard=null;
let currentMainCard=null;

/*   open activity stage*/
export function openActivityStage({carousel,activeIndex,item,mainCard}){
  if(activityOpen||!carousel||!item||!mainCard||isStageMotionLocked()){
    return false;
  }

  const newActivityCard=createActivityCard(item);
  newActivityCard.addEventListener("click",handleActivityCardClick);
  mainCard.addEventListener("click",handleMainCardBack);
  carousel.appendChild(newActivityCard);

  const opened=beginStageMotion({carousel,activeIndex,card:newActivityCard});
  if(!opened){
    newActivityCard.removeEventListener("click",handleActivityCardClick);
    mainCard.removeEventListener("click",handleMainCardBack);
    newActivityCard.remove();
    return false;
  }

  activityCard=newActivityCard;
  currentMainCard=mainCard;
  activityOpen=true;
  return true;
}

function handleActivityCardClick(event){
  event.stopPropagation();
}

function handleMainCardBack(event){
  if(!activityOpen||!currentMainCard?.classList.contains("is-stage-back")||isStageMotionLocked()){
    return;
  }
  event.stopPropagation();
  closeActivityStage();
}

/*   close activity stage*/
export function closeActivityStage(){
  if(!activityOpen||!activityCard||isStageMotionLocked()){
    return false;
  }

  const closingCard=activityCard;
  const closed=popStageCard(closingCard);
  if(!closed){return false;}

  closingCard.removeEventListener("click",handleActivityCardClick);
  currentMainCard?.removeEventListener("click",handleMainCardBack);
  activityCard=null;
  currentMainCard=null;
  activityOpen=false;
  return true;
}

export function isActivityStageOpen(){
  return activityOpen;
}
