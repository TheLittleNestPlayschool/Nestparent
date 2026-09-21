import{createOurNestCard}from"./parent_our_nest_card.js";
import{createOurNestDetailCard}from"./parent_our_nest_detail_card.js";
import{pushStageCard,popStageCard,isStageMotionLocked}from"./parent_stage_motion.js";

let ourNestOpen=false;
let ourNestCard=null;
let detailOpen=false;
let detailCard=null;
let currentNestCard=null;
let currentCarousel=null;

/*   open our nest stage*/
export function openOurNestStage({carousel,nestCard}){
  if(ourNestOpen||!carousel||!nestCard||isStageMotionLocked())return;
  const newOurNestCard=createOurNestCard();
  nestCard.addEventListener("click",handleNestCardBack);
  carousel.appendChild(newOurNestCard);
  if(!pushStageCard(newOurNestCard)){
    nestCard.removeEventListener("click",handleNestCardBack);
    newOurNestCard.remove();
    return;
  }
  ourNestCard=newOurNestCard;
  currentNestCard=nestCard;
  currentCarousel=carousel;
  ourNestOpen=true;
}

/*   open our nest detail*/
export function openOurNestDetailStage(option){
  if(!ourNestOpen||detailOpen||!ourNestCard||!currentCarousel||isStageMotionLocked())return;
  const newDetailCard=createOurNestDetailCard(option);
  ourNestCard.addEventListener("click",handleOurNestCardBack);
  currentCarousel.appendChild(newDetailCard);
  if(!pushStageCard(newDetailCard)){
    ourNestCard.removeEventListener("click",handleOurNestCardBack);
    newDetailCard.remove();
    return;
  }
  detailCard=newDetailCard;
  detailOpen=true;
}

/*   our nest card back*/
function handleOurNestCardBack(event){
  if(!detailOpen||!ourNestCard?.classList.contains("is-stage-back"))return;
  event.stopPropagation();
  closeOurNestDetailStage();
}

/*   nest card back*/
function handleNestCardBack(event){
  if(!ourNestOpen||detailOpen||!currentNestCard?.classList.contains("is-stage-back"))return;
  event.stopPropagation();
  closeOurNestStage();
}

/*   close our nest detail*/
export function closeOurNestDetailStage(){
  if(!detailOpen||!detailCard||isStageMotionLocked())return;
  const closingCard=detailCard;
  if(!popStageCard(closingCard))return;
  ourNestCard?.removeEventListener("click",handleOurNestCardBack);
  detailCard=null;
  detailOpen=false;
}

/*   close our nest stage*/
export function closeOurNestStage(){
  if(!ourNestOpen||!ourNestCard||isStageMotionLocked())return;
  if(detailOpen){
    closeOurNestDetailStage();
    return;
  }
  const closingCard=ourNestCard;
  if(!popStageCard(closingCard))return;
  currentNestCard?.removeEventListener("click",handleNestCardBack);
  ourNestCard=null;
  currentNestCard=null;
  currentCarousel=null;
  ourNestOpen=false;
}

/*   our nest state*/
export function isOurNestStageOpen(){return ourNestOpen;}
export function isOurNestDetailStageOpen(){return detailOpen;}
