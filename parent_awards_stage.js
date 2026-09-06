import{
  createAwardsCard,
  createAwardCategoryCard,
  createAwardDetailCard
}from"./parent_awards_card.js";
import{
  pushStageCard,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";

let awardsOpen=false;
let awardsCard=null;
let categoryCard=null;
let detailCard=null;
let currentNestCard=null;
let currentCarousel=null;

/*   open awards stage*/
export function openAwardsStage({carousel,nestCard}){
  if(
    awardsOpen||
    !carousel||
    !nestCard||
    isStageMotionLocked()
  ){
    return;
  }

  const newAwardsCard=createAwardsCard({
    onCategory:openCategory
  });

  newAwardsCard.addEventListener("click",handleAwardsCardBack);
  nestCard.addEventListener("click",handleNestCardBack);
  carousel.appendChild(newAwardsCard);

  const pushed=pushStageCard(newAwardsCard);
  if(!pushed){
    newAwardsCard.removeEventListener("click",handleAwardsCardBack);
    nestCard.removeEventListener("click",handleNestCardBack);
    newAwardsCard.remove();
    return;
  }

  awardsCard=newAwardsCard;
  currentNestCard=nestCard;
  currentCarousel=carousel;
  awardsOpen=true;
}

/*   open category*/
function openCategory(categoryId){
  if(
    !awardsOpen||
    categoryCard||
    isStageMotionLocked()
  ){
    return false;
  }

  const newCategoryCard=createAwardCategoryCard({
    categoryId,
    onAward:openAward
  });

  newCategoryCard.addEventListener("click",handleCategoryCardBack);
  currentCarousel.appendChild(newCategoryCard);

  const pushed=pushStageCard(newCategoryCard);
  if(!pushed){
    newCategoryCard.removeEventListener("click",handleCategoryCardBack);
    newCategoryCard.remove();
    return false;
  }

  categoryCard=newCategoryCard;
  return true;
}

/*   open award*/
function openAward({categoryId,badgeId}){
  if(
    !categoryCard||
    detailCard||
    isStageMotionLocked()
  ){
    return false;
  }

  const newDetailCard=createAwardDetailCard({
    categoryId,
    badgeId
  });

  currentCarousel.appendChild(newDetailCard);

  const pushed=pushStageCard(newDetailCard);
  if(!pushed){
    newDetailCard.remove();
    return false;
  }

  detailCard=newDetailCard;
  return true;
}

/*   category card back*/
function handleCategoryCardBack(event){
  if(
    !categoryCard||
    !categoryCard.classList.contains("is-stage-back")||
    isStageMotionLocked()
  ){
    return;
  }

  event.stopPropagation();

  if(detailCard){
    const closingCard=detailCard;
    const closed=popStageCard(closingCard);
    if(!closed){return;}
    detailCard=null;
  }
}

/*   awards card back*/
function handleAwardsCardBack(event){
  if(
    !awardsCard||
    !awardsCard.classList.contains("is-stage-back")||
    detailCard||
    isStageMotionLocked()
  ){
    return;
  }

  event.stopPropagation();

  if(categoryCard){
    const closingCard=categoryCard;
    const closed=popStageCard(closingCard);
    if(!closed){return;}
    closingCard.removeEventListener("click",handleCategoryCardBack);
    categoryCard=null;
  }
}

/*   nest card back*/
function handleNestCardBack(event){
  if(
    !awardsOpen||
    !currentNestCard?.classList.contains("is-stage-back")||
    categoryCard||
    detailCard||
    isStageMotionLocked()
  ){
    return;
  }

  event.stopPropagation();
  closeAwardsStage();
}

/*   close awards stage*/
export function closeAwardsStage(){
  if(!awardsOpen||isStageMotionLocked()){
    return;
  }

  if(detailCard){
    const closingCard=detailCard;
    const closed=popStageCard(closingCard);
    if(!closed){return;}
    detailCard=null;
    return;
  }

  if(categoryCard){
    const closingCard=categoryCard;
    const closed=popStageCard(closingCard);
    if(!closed){return;}
    closingCard.removeEventListener("click",handleCategoryCardBack);
    categoryCard=null;
    return;
  }

  const closingCard=awardsCard;
  const closed=popStageCard(closingCard);
  if(!closed){return;}

  closingCard?.removeEventListener("click",handleAwardsCardBack);
  currentNestCard?.removeEventListener("click",handleNestCardBack);

  awardsCard=null;
  currentNestCard=null;
  currentCarousel=null;
  awardsOpen=false;
}

/*   stage state*/
export function isAwardsStageOpen(){return awardsOpen;}
