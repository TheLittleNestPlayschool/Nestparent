import{
  getExperiences
}from"./parent_experiences.js";

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
  openNestStage as openNestStageView,
  closeNestStage as closeNestStageView,
  isNestStageOpen
}from"./parent_nest_stage.js";

const carousel=
  document.getElementById(
    "carousel"
  );

const hint=
  document.getElementById(
    "hint"
  );

const deepSheet=
  document.getElementById(
    "deepSheet"
  );

let activeIndex=0;
let hasInteracted=false;

/*   build cards*/
export function buildCards(){
  if(!carousel){
    return;
  }

  const experiences=
    getExperiences();

  buildExperienceCards(
    carousel,
    openExperience
  );

  activateRestingAtmosphere(
    experiences[
      activeIndex
    ]
  );

  renderPositions();
}

/*   open experience*/
function openExperience(index){
  if(isNestStageOpen()){
    return;
  }

  if(
    index===
    activeIndex+1
  ){
    move(1);
    return;
  }

  if(
    index===
    activeIndex-1
  ){
    move(-1);
    return;
  }

  /*
    Center card intentionally does
    nothing for now.

    Later this becomes the entrance
    into the card's real experience.
  */
}

/*   render positions*/
function renderPositions(){
  renderCardPositions({
    carousel,
    activeIndex,
    nestOpen:
      isNestStageOpen()
  });
}

/*   move*/
function move(direction){
  if(isNestStageOpen()){
    return;
  }

  const experiences=
    getExperiences();

  const next=
    Math.min(
      experiences.length-1,
      Math.max(
        0,
        activeIndex+direction
      )
    );

  if(next===activeIndex){
    return;
  }

  activeIndex=next;

  setRestingAtmosphere(
    experiences[
      activeIndex
    ]
  );

  renderPositions();
  hideHint();
}

/*   hide hint*/
export function hideHint(){
  if(hasInteracted){
    return;
  }

  hasInteracted=true;

  if(hint){
    hint.style.opacity="0";
  }
}

/*   open nest stage*/
export function openNestStage(){
  openNestStageView({
    carousel,
    activeIndex,
    hideHint
  });
}

/*   close nest stage*/
export function closeNestStage(){
  closeNestStageView({
    carousel,
    activeIndex
  });
}

/*   expose nest state*/
export{
  isNestStageOpen
};

/*   activate carousel*/
export function activateCarousel(){
  activateCarouselInput({
    carousel,
    deepSheet,

    canMove:()=>{
      return !isNestStageOpen();
    },

    onMove:
      move
  });
}
