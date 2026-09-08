import{createTogetherCard}from"./parent_together_card.js";
import{
  beginStageMotion,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";

let togetherOpen=false;
let togetherCard=null;
let currentMainCard=null;

/*   open together stage*/
export function openTogetherStage({carousel,activeIndex,item,mainCard}){
  if(togetherOpen||!carousel||!item||!mainCard||isStageMotionLocked()){
    return false;
  }

  const newTogetherCard=createTogetherCard(item);
  newTogetherCard.addEventListener("click",handleTogetherCardClick);
  mainCard.addEventListener("click",handleMainCardBack);
  carousel.appendChild(newTogetherCard);

  const opened=beginStageMotion({carousel,activeIndex,card:newTogetherCard});
  if(!opened){
    newTogetherCard.removeEventListener("click",handleTogetherCardClick);
    mainCard.removeEventListener("click",handleMainCardBack);
    newTogetherCard.remove();
    return false;
  }

  togetherCard=newTogetherCard;
  currentMainCard=mainCard;
  togetherOpen=true;
  return true;
}

function handleTogetherCardClick(event){
  event.stopPropagation();
}

function handleMainCardBack(event){
  if(!togetherOpen||!currentMainCard?.classList.contains("is-stage-back")||isStageMotionLocked()){
    return;
  }
  event.stopPropagation();
  closeTogetherStage();
}

/*   close together stage*/
export function closeTogetherStage(){
  if(!togetherOpen||!togetherCard||isStageMotionLocked()){
    return false;
  }

  const closingCard=togetherCard;
  const closed=popStageCard(closingCard);
  if(!closed){return false;}

  closingCard.removeEventListener("click",handleTogetherCardClick);
  currentMainCard?.removeEventListener("click",handleMainCardBack);
  togetherCard=null;
  currentMainCard=null;
  togetherOpen=false;
  return true;
}

export function isTogetherStageOpen(){
  return togetherOpen;
}
