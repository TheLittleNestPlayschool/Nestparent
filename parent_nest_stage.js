import{createNestCard}from"./parent_nest_card.js";
import{renderCardPositions}from"./parent_card_positions.js";

let nestOpen=false;
let nestCard=null;
let mainBackCard=null;
let returnTimer=null;

/*   get main back card*/
function getMainBackCard(carousel,activeIndex){
  if(!carousel){return null;}
  return carousel.querySelector(`.experience:not(.nest-experience)[data-index="${activeIndex}"]`);
}

/*   activate main back card*/
function activateMainBackCard(carousel,activeIndex){
  mainBackCard=getMainBackCard(carousel,activeIndex);
  if(!mainBackCard){return;}
  mainBackCard.classList.add("is-stage-back");
  mainBackCard.style.pointerEvents="auto";
  mainBackCard.addEventListener("click",handleMainBackCard);
}

/*   deactivate main back card*/
function deactivateMainBackCard(){
  if(!mainBackCard){return;}
  mainBackCard.classList.remove("is-stage-back");
  mainBackCard.removeEventListener("click",handleMainBackCard);
  mainBackCard.style.pointerEvents="none";
}

/*   main card back*/
function handleMainBackCard(event){
  event.stopPropagation();
  window.dispatchEvent(new CustomEvent("parent:return-main-stage"));
}

/*   open nest stage*/
export function openNestStage({carousel,activeIndex,hideHint}){
  if(nestOpen||nestCard||!carousel){return;}

  if(returnTimer){
    clearTimeout(returnTimer);
    returnTimer=null;
  }

  nestOpen=true;

  if(typeof hideHint==="function"){
    hideHint();
  }

  nestCard=createNestCard();
  carousel.appendChild(nestCard);
  void nestCard.offsetWidth;

  /*   mark the current main card as Back before it moves*/
  activateMainBackCard(carousel,activeIndex);

  /*   move current card right*/
  renderCardPositions({carousel,activeIndex,nestOpen:true});

  /*   reveal nest*/
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      if(!nestCard){return;}
      nestCard.classList.add("is-visible");
    });
  });
}

/*   close nest stage*/
export function closeNestStage({carousel,activeIndex}){
  if(!nestOpen||!carousel){return;}

  nestOpen=false;

  const cardToRemove=nestCard;
  const returningCard=mainBackCard||getMainBackCard(carousel,activeIndex);

  /*   stop back interaction*/
  deactivateMainBackCard();

  /*   returning main card stays above Nest*/
  if(returningCard){
    returningCard.classList.add("is-returning-front");
    returningCard.style.pointerEvents="none";
  }

  /*   Nest fades underneath*/
  if(cardToRemove){
    cardToRemove.classList.remove("is-visible");
    cardToRemove.classList.add("is-leaving-under");
    cardToRemove.style.pointerEvents="none";
  }

  /*   begin return glide*/
  returnTimer=window.setTimeout(()=>{
    returnTimer=null;
    renderCardPositions({carousel,activeIndex,nestOpen:false});
  },110);

  /*   remove Nest after fade*/
  window.setTimeout(()=>{
    if(cardToRemove&&cardToRemove.parentNode){
      cardToRemove.remove();
    }
    if(nestCard===cardToRemove){
      nestCard=null;
    }
  },1050);

  /*   release main card after glide*/
  window.setTimeout(()=>{
    if(returningCard){
      returningCard.classList.remove("is-returning-front");
      returningCard.style.pointerEvents="auto";
    }
    if(mainBackCard===returningCard){
      mainBackCard=null;
    }
  },1700);
}

/*   nest state*/
export function isNestStageOpen(){return nestOpen;}

/*   current nest card*/
export function getNestCard(){return nestCard;}
