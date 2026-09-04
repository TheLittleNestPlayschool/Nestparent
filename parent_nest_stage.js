import{createNestCard}from"./parent_nest_card.js";
import{
  beginStageMotion,
  popStageCard,
  isStageMotionLocked
}from"./parent_stage_motion.js";

let nestOpen=false;
let nestCard=null;
let mainBackCard=null;

/*   get main back card*/
function getMainBackCard(carousel,activeIndex){
  if(!carousel){return null;}
  return carousel.querySelector(
    `.experience[data-index="${activeIndex}"]`
  );
}

/*   activate main back card*/
function activateMainBackCard(carousel,activeIndex){
  mainBackCard=getMainBackCard(carousel,activeIndex);
  if(!mainBackCard){return;}
  mainBackCard.addEventListener("click",handleMainBackCard);
}

/*   deactivate main back card*/
function deactivateMainBackCard(){
  if(!mainBackCard){return;}
  mainBackCard.removeEventListener("click",handleMainBackCard);
  mainBackCard=null;
}

/*   main card back*/
function handleMainBackCard(event){
  if(
    !mainBackCard||
    !mainBackCard.classList.contains("is-stage-back")
  ){
    return;
  }

  event.stopPropagation();
  window.dispatchEvent(
    new CustomEvent("parent:return-main-stage")
  );
}

/*   open nest stage*/
export function openNestStage({carousel,activeIndex,hideHint}){
  if(
    nestOpen||
    nestCard||
    !carousel||
    isStageMotionLocked()
  ){
    return;
  }

  if(typeof hideHint==="function"){
    hideHint();
  }

  const newNestCard=createNestCard();
  carousel.appendChild(newNestCard);
  activateMainBackCard(carousel,activeIndex);

  const started=beginStageMotion({
    carousel,
    activeIndex,
    card:newNestCard
  });

  if(!started){
    deactivateMainBackCard();
    newNestCard.remove();
    return;
  }

  nestCard=newNestCard;
  nestOpen=true;
}

/*   close nest stage*/
export function closeNestStage(){
  if(
    !nestOpen||
    !nestCard||
    isStageMotionLocked()
  ){
    return;
  }

  const closingCard=nestCard;
  const closed=popStageCard(closingCard);
  if(!closed){return;}

  deactivateMainBackCard();
  nestCard=null;
  nestOpen=false;
}

/*   nest state*/
export function isNestStageOpen(){return nestOpen;}

/*   current nest card*/
export function getNestCard(){return nestCard;}
