import{createGrowthCard}from"./parent_growth_card.js";
import{
  beginStageMotion,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";

let growthOpen=false;
let growthCard=null;
let currentMainCard=null;

/*   open growth stage*/
export function openGrowthStage({carousel,activeIndex,item,mainCard}){
  if(growthOpen||!carousel||!item||!mainCard||isStageMotionLocked()){
    return false;
  }

  const newGrowthCard=createGrowthCard(item);
  newGrowthCard.addEventListener("click",handleGrowthCardClick);
  mainCard.addEventListener("click",handleMainCardBack);
  carousel.appendChild(newGrowthCard);

  const opened=beginStageMotion({carousel,activeIndex,card:newGrowthCard});
  if(!opened){
    newGrowthCard.removeEventListener("click",handleGrowthCardClick);
    mainCard.removeEventListener("click",handleMainCardBack);
    newGrowthCard.remove();
    return false;
  }

  growthCard=newGrowthCard;
  currentMainCard=mainCard;
  growthOpen=true;
  return true;
}

function handleGrowthCardClick(event){
  event.stopPropagation();
}

function handleMainCardBack(event){
  if(!growthOpen||!currentMainCard?.classList.contains("is-stage-back")||isStageMotionLocked()){
    return;
  }
  event.stopPropagation();
  closeGrowthStage();
}

/*   close growth stage*/
export function closeGrowthStage(){
  if(!growthOpen||!growthCard||isStageMotionLocked()){
    return false;
  }

  const closingCard=growthCard;
  const closed=popStageCard(closingCard);
  if(!closed){return false;}

  closingCard.removeEventListener("click",handleGrowthCardClick);
  currentMainCard?.removeEventListener("click",handleMainCardBack);
  growthCard=null;
  currentMainCard=null;
  growthOpen=false;
  return true;
}

export function isGrowthStageOpen(){
  return growthOpen;
}
