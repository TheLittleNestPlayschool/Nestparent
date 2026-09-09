import{
  getParentExperiences
}from"./parent_experience_feed.js";

import{
  buildExperienceCards
}from"./parent_card_builder.js";

import{
  renderCardPositions
}from"./parent_card_positions.js";

import{
  activateCarouselInput
}from"./parent_carousel_input.js";

import{
  activateRestingAtmosphere,
  setRestingAtmosphere
}from"./parent_resting_atmosphere.js";

import{
  isStageMotionLocked
}from"./parent_stage_motion.js";

import{
  openStoryStage,
  isStoryStageOpen
}from"./parent_story_stage.js";

import{
  openLearningStage,
  isLearningStageOpen
}from"./parent_learning_stage.js";

import{
  openActivityStage,
  isActivityStageOpen
}from"./parent_activity_stage.js";

import{
  openGrowthStage,
  isGrowthStageOpen
}from"./parent_growth_stage.js";

import{
  openNestStage as openNestStageView,
  closeNestStage as closeNestStageView,
  isNestStageOpen
}from"./parent_nest_stage.js";

const carousel=document.getElementById("carousel");
const hint=document.getElementById("hint");
const deepSheet=document.getElementById("deepSheet");

let activeIndex=0;
let hasInteracted=false;

/*   experience stage open*/
function isExperienceStageOpen(){
  return isStoryStageOpen()||isLearningStageOpen()||isActivityStageOpen()||isGrowthStageOpen();
}

/*   build cards*/
export function buildCards(){
  if(!carousel){return;}
  const experiences=getParentExperiences();
  buildExperienceCards(carousel,openExperience);
  activateRestingAtmosphere(experiences[activeIndex]);
  renderPositions();
}

/*   open experience*/
function openExperience(index){
  if(isNestStageOpen()||isExperienceStageOpen()||isStageMotionLocked()){
    return;
  }

  if(index===activeIndex+1){
    move(1);
    return;
  }

  if(index===activeIndex-1){
    move(-1);
    return;
  }

  if(index!==activeIndex){return;}

  const experiences=getParentExperiences();
  const item=experiences[index];
  const mainCard=carousel?.querySelector(`.experience[data-index="${index}"]`);
  if(!item||!mainCard){return;}

  if(item.experience_type_code==="today_story"){
    openStoryStage({carousel,activeIndex:index,item,mainCard});
    hideHint();
    return;
  }

  if(item.experience_type_code==="learning_discovery"){
    openLearningStage({carousel,activeIndex:index,item,mainCard});
    hideHint();
    return;
  }

  if(item.experience_type_code==="activity"){
    openActivityStage({carousel,activeIndex:index,item,mainCard});
    hideHint();
    return;
  }

  if(item.experience_type_code==="growth"){
    openGrowthStage({carousel,activeIndex:index,item,mainCard});
    hideHint();
    return;
  }

  if(
    item.experience_type_code==="moments"||
    item.experience_type_code==="together"||
    item.experience_type_code==="celebration"
  ){
    return;
  }
}

/*   render positions*/
function renderPositions(){
  renderCardPositions({
    carousel,
    activeIndex,
    nestOpen:isNestStageOpen()
  });
}

/*   move*/
function move(direction){
  if(isNestStageOpen()||isExperienceStageOpen()||isStageMotionLocked()){
    return;
  }

  const experiences=getParentExperiences();
  const next=Math.min(experiences.length-1,Math.max(0,activeIndex+direction));
  if(next===activeIndex){return;}

  activeIndex=next;
  setRestingAtmosphere(experiences[activeIndex]);
  renderPositions();
  hideHint();
}

/*   hide hint*/
export function hideHint(){
  if(hasInteracted){return;}
  hasInteracted=true;
  if(hint){hint.style.opacity="0";}
}

/*   open nest stage*/
export function openNestStage(){
  if(isStageMotionLocked()||isExperienceStageOpen()){
    return;
  }

  openNestStageView({
    carousel,
    activeIndex,
    hideHint
  });
}

/*   close nest stage*/
export function closeNestStage(){
  closeNestStageView({carousel,activeIndex});
}

/*   expose nest state*/
export{isNestStageOpen};

/*   activate carousel*/
export function activateCarousel(){
  activateCarouselInput({
    carousel,
    deepSheet,
    canMove:()=>!isNestStageOpen()&&!isExperienceStageOpen()&&!isStageMotionLocked(),
    onMove:move
  });
}
