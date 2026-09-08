import{createStoryCard}from"./parent_story_card.js";
import{
  beginStageMotion,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";

let storyOpen=false;
let storyCard=null;
let currentMainCard=null;

/*   open story stage*/
export function openStoryStage({carousel,activeIndex,item,mainCard}){
  if(
    storyOpen||
    !carousel||
    !item||
    !mainCard||
    isStageMotionLocked()
  ){
    return false;
  }

  const newStoryCard=createStoryCard(item);
  newStoryCard.addEventListener("click",handleStoryCardClick);
  mainCard.addEventListener("click",handleMainCardBack);
  carousel.appendChild(newStoryCard);

  const opened=beginStageMotion({
    carousel,
    activeIndex,
    card:newStoryCard
  });

  if(!opened){
    newStoryCard.removeEventListener("click",handleStoryCardClick);
    mainCard.removeEventListener("click",handleMainCardBack);
    newStoryCard.remove();
    return false;
  }

  storyCard=newStoryCard;
  currentMainCard=mainCard;
  storyOpen=true;
  return true;
}

/*   expanded story click*/
function handleStoryCardClick(event){
  event.stopPropagation();
}

/*   main story card becomes back card*/
function handleMainCardBack(event){
  if(
    !storyOpen||
    !currentMainCard?.classList.contains("is-stage-back")||
    isStageMotionLocked()
  ){
    return;
  }

  event.stopPropagation();
  closeStoryStage();
}

/*   close story stage*/
export function closeStoryStage(){
  if(!storyOpen||!storyCard||isStageMotionLocked()){
    return false;
  }

  const closingCard=storyCard;
  const closed=popStageCard(closingCard);
  if(!closed){return false;}

  closingCard.removeEventListener("click",handleStoryCardClick);
  currentMainCard?.removeEventListener("click",handleMainCardBack);
  storyCard=null;
  currentMainCard=null;
  storyOpen=false;
  return true;
}

/*   story stage state*/
export function isStoryStageOpen(){
  return storyOpen;
}
