import{createLearningCard}from"./parent_learning_card.js";
import{
  beginStageMotion,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";

let learningOpen=false;
let learningCard=null;
let currentMainCard=null;

/*   open learning stage*/
export function openLearningStage({carousel,activeIndex,item,mainCard}){
  if(
    learningOpen||
    !carousel||
    !item||
    !mainCard||
    isStageMotionLocked()
  ){
    return false;
  }

  const newLearningCard=createLearningCard(item);
  newLearningCard.addEventListener("click",handleLearningCardClick);
  mainCard.addEventListener("click",handleMainCardBack);
  carousel.appendChild(newLearningCard);

  const opened=beginStageMotion({
    carousel,
    activeIndex,
    card:newLearningCard
  });

  if(!opened){
    newLearningCard.removeEventListener("click",handleLearningCardClick);
    mainCard.removeEventListener("click",handleMainCardBack);
    newLearningCard.remove();
    return false;
  }

  learningCard=newLearningCard;
  currentMainCard=mainCard;
  learningOpen=true;
  return true;
}

/*   expanded learning click*/
function handleLearningCardClick(event){
  event.stopPropagation();
}

/*   main learning card becomes back card*/
function handleMainCardBack(event){
  if(
    !learningOpen||
    !currentMainCard?.classList.contains("is-stage-back")||
    isStageMotionLocked()
  ){
    return;
  }

  event.stopPropagation();
  closeLearningStage();
}

/*   close learning stage*/
export function closeLearningStage(){
  if(!learningOpen||!learningCard||isStageMotionLocked()){
    return false;
  }

  const closingCard=learningCard;
  const closed=popStageCard(closingCard);
  if(!closed){return false;}

  closingCard.removeEventListener("click",handleLearningCardClick);
  currentMainCard?.removeEventListener("click",handleMainCardBack);
  learningCard=null;
  currentMainCard=null;
  learningOpen=false;
  return true;
}

/*   learning stage state*/
export function isLearningStageOpen(){
  return learningOpen;
}
