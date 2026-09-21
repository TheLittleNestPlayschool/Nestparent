import{createJourneyCard}from"./parent_journey_card.js";
import{pushStageCard,popStageCard,isStageMotionLocked}from"./parent_stage_motion.js";

let journeyOpen=false;
let journeyCard=null;
let currentNestCard=null;

/*   open journey stage*/
export function openJourneyStage({carousel,nestCard}){
  if(journeyOpen||!carousel||!nestCard||isStageMotionLocked())return;
  const newJourneyCard=createJourneyCard();
  nestCard.addEventListener("click",handleNestCardBack);
  carousel.appendChild(newJourneyCard);
  if(!pushStageCard(newJourneyCard)){
    nestCard.removeEventListener("click",handleNestCardBack);
    newJourneyCard.remove();
    return;
  }
  journeyCard=newJourneyCard;
  currentNestCard=nestCard;
  journeyOpen=true;
}

/*   nest card back*/
function handleNestCardBack(event){
  if(!journeyOpen||!currentNestCard?.classList.contains("is-stage-back"))return;
  event.stopPropagation();
  closeJourneyStage();
}

/*   close journey stage*/
export function closeJourneyStage(){
  if(!journeyOpen||!journeyCard||isStageMotionLocked())return;
  const closingCard=journeyCard;
  if(!popStageCard(closingCard))return;
  currentNestCard?.removeEventListener("click",handleNestCardBack);
  journeyCard=null;
  currentNestCard=null;
  journeyOpen=false;
}

/*   journey state*/
export function isJourneyStageOpen(){return journeyOpen;}
