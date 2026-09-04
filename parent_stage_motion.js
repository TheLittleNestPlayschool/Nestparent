import{
  renderCardOffset,
  renderCardPositions
}from"./parent_card_positions.js";

const STAGE_MOTION_MS=1450;

let currentCarousel=null;
let currentActiveIndex=0;
let stageCards=[];
let motionTimer=null;
let motionLocked=false;

/*   get main card*/
function getMainCard(){
  if(!currentCarousel){return null;}
  return currentCarousel.querySelector(
    `.experience[data-index="${currentActiveIndex}"]`
  );
}

/*   get back card*/
function getBackCard(){
  if(stageCards.length===0){return null;}
  if(stageCards.length===1){return getMainCard();}
  return stageCards[stageCards.length-2]||null;
}

/*   clear back state*/
function clearBackState(){
  const mainCard=getMainCard();
  if(mainCard){mainCard.classList.remove("is-stage-back");}
  stageCards.forEach(card=>card.classList.remove("is-stage-back"));
}

/*   apply back state*/
function applyBackState(){
  clearBackState();
  const backCard=getBackCard();
  if(backCard){backCard.classList.add("is-stage-back");}
}

/*   lock stage interaction*/
function lockStage(){
  motionLocked=true;
  const mainCard=getMainCard();
  if(mainCard){mainCard.classList.add("is-stage-moving");}
  stageCards.forEach(card=>card.classList.add("is-stage-moving"));
}

/*   release stage interaction*/
function releaseStage(){
  motionLocked=false;
  const mainCard=getMainCard();
  if(mainCard){mainCard.classList.remove("is-stage-moving");}
  stageCards.forEach(card=>card.classList.remove("is-stage-moving"));
}

/*   schedule release*/
function scheduleRelease(){
  if(motionTimer){clearTimeout(motionTimer);}
  motionTimer=window.setTimeout(()=>{
    motionTimer=null;
    releaseStage();
  },STAGE_MOTION_MS+40);
}

/*   render current stack*/
function renderStageStack(){
  if(!currentCarousel){return;}

  const depth=stageCards.length;

  renderCardPositions({
    carousel:currentCarousel,
    activeIndex:currentActiveIndex,
    nestOpen:depth>0,
    stageDepth:depth
  });

  stageCards.forEach((card,index)=>{
    const offset=depth-1-index;
    renderCardOffset(card,offset);
  });
}

/*   prepare entering card*/
function prepareEnteringCard(card){
  if(!card){return;}
  renderCardOffset(card,-1);
  card.style.opacity="0";
  card.style.pointerEvents="none";
  card.classList.add("is-stage-moving");
  void card.offsetWidth;
}

/*   begin stack*/
export function beginStageMotion({carousel,activeIndex,card}){
  if(!carousel||!card||stageCards.length>0||motionLocked){return false;}

  currentCarousel=carousel;
  currentActiveIndex=activeIndex;

  prepareEnteringCard(card);
  stageCards=[card];
  applyBackState();
  lockStage();

  requestAnimationFrame(()=>{
    renderStageStack();
    scheduleRelease();
  });

  return true;
}

/*   push stage*/
export function pushStageCard(card){
  if(!currentCarousel||!card||motionLocked){return false;}

  prepareEnteringCard(card);
  stageCards.push(card);
  applyBackState();
  lockStage();

  requestAnimationFrame(()=>{
    renderStageStack();
    scheduleRelease();
  });

  return true;
}

/*   pop stage*/
export function popStageCard(card){
  if(!currentCarousel||motionLocked||stageCards.length===0){return false;}

  const leavingCard=stageCards[stageCards.length-1];
  if(card&&leavingCard!==card){return false;}

  stageCards.pop();
  applyBackState();
  lockStage();

  renderCardOffset(leavingCard,-1);
  leavingCard.style.pointerEvents="none";
  renderStageStack();
  scheduleRelease();

  window.setTimeout(()=>{
    if(leavingCard?.parentNode){leavingCard.remove();}

    if(stageCards.length===0){
      clearBackState();
      currentCarousel=null;
      currentActiveIndex=0;
    }
  },STAGE_MOTION_MS+80);

  return true;
}

/*   stage motion state*/
export function isStageMotionLocked(){return motionLocked;}
export function getStageDepth(){return stageCards.length;}
