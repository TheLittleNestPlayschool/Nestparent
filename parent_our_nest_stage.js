import{createOurNestCard}from"./parent_our_nest_card.js";
import{createOurNestDetailCard}from"./parent_our_nest_detail_card.js?v=3";
import{
  createPrivacyNoticeCard,
  loadPrivacyNoticeCard
}from"./parent_privacy_notice_card.js?v=1";
import{
  createLanguageCard,
  loadLanguageCard
}from"./parent_language_card.js?v=3";
import{pushStageCard,popStageCard,isStageMotionLocked}from"./parent_stage_motion.js";

let ourNestOpen=false;
let ourNestCard=null;
let detailOpen=false;
let detailCard=null;
let privacyOpen=false;
let privacyCard=null;
let languageOpen=false;
let languageCard=null;
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

/*   open privacy notice*/
export function openPrivacyNoticeStage(){
  if(!detailOpen||privacyOpen||languageOpen||!detailCard||!currentCarousel||isStageMotionLocked())return;
  const newPrivacyCard=createPrivacyNoticeCard();
  detailCard.addEventListener("click",handleDetailCardBack);
  currentCarousel.appendChild(newPrivacyCard);
  if(!pushStageCard(newPrivacyCard)){
    detailCard.removeEventListener("click",handleDetailCardBack);
    newPrivacyCard.remove();
    return;
  }
  privacyCard=newPrivacyCard;
  privacyOpen=true;
  loadPrivacyNoticeCard(newPrivacyCard);
}

/*   open language*/
export function openLanguageStage(){
  if(!detailOpen||languageOpen||privacyOpen||!detailCard||!currentCarousel||isStageMotionLocked())return;
  const newLanguageCard=createLanguageCard();
  detailCard.addEventListener("click",handleDetailCardBack);
  currentCarousel.appendChild(newLanguageCard);
  if(!pushStageCard(newLanguageCard)){
    detailCard.removeEventListener("click",handleDetailCardBack);
    newLanguageCard.remove();
    return;
  }
  languageCard=newLanguageCard;
  languageOpen=true;
  loadLanguageCard(newLanguageCard);
}

/*   detail card back*/
function handleDetailCardBack(event){
  if(!detailCard?.classList.contains("is-stage-back"))return;
  if(privacyOpen){
    event.stopPropagation();
    closePrivacyNoticeStage();
    return;
  }
  if(languageOpen){
    event.stopPropagation();
    closeLanguageStage();
  }
}

/*   our nest card back*/
function handleOurNestCardBack(event){
  if(!detailOpen||privacyOpen||languageOpen||!ourNestCard?.classList.contains("is-stage-back"))return;
  event.stopPropagation();
  closeOurNestDetailStage();
}

/*   nest card back*/
function handleNestCardBack(event){
  if(!ourNestOpen||detailOpen||!currentNestCard?.classList.contains("is-stage-back"))return;
  event.stopPropagation();
  closeOurNestStage();
}

/*   close privacy notice*/
export function closePrivacyNoticeStage(){
  if(!privacyOpen||!privacyCard||isStageMotionLocked())return;
  const closingCard=privacyCard;
  if(!popStageCard(closingCard))return;
  detailCard?.removeEventListener("click",handleDetailCardBack);
  privacyCard=null;
  privacyOpen=false;
}

/*   close language*/
export function closeLanguageStage(){
  if(!languageOpen||!languageCard||isStageMotionLocked())return;
  const closingCard=languageCard;
  if(!popStageCard(closingCard))return;
  detailCard?.removeEventListener("click",handleDetailCardBack);
  languageCard=null;
  languageOpen=false;
}

/*   close our nest detail*/
export function closeOurNestDetailStage(){
  if(!detailOpen||!detailCard||isStageMotionLocked())return;
  if(privacyOpen){
    closePrivacyNoticeStage();
    return;
  }
  if(languageOpen){
    closeLanguageStage();
    return;
  }
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
export function isPrivacyNoticeStageOpen(){return privacyOpen;}
export function isLanguageStageOpen(){return languageOpen;}
