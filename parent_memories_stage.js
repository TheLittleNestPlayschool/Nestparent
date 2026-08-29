import{
  createMemoriesCard
}from"./parent_memories_card.js";

import{
  createMemoryTodayCard
}from"./parent_memory_today_card.js";

import{
  renderCardOffset
}from"./parent_card_positions.js";

let memoriesOpen=false;
let memoriesCard=null;
let currentNestCard=null;
let currentCarousel=null;
let closeTimer=null;

let todayOpen=false;
let todayCard=null;
let todayCloseTimer=null;

/*   open memories stage*/
export function openMemoriesStage({
  carousel,
  nestCard
}){
  if(
    memoriesOpen||
    !carousel||
    !nestCard
  ){
    return;
  }

  if(closeTimer){
    clearTimeout(closeTimer);
    closeTimer=null;
  }

  memoriesOpen=true;
  currentCarousel=carousel;
  currentNestCard=nestCard;

  memoriesCard=
    createMemoriesCard({
      onChapter:
        handleMemoryChapter
    });

  carousel.appendChild(
    memoriesCard
  );

  void memoriesCard.offsetWidth;

  renderCardOffset(
    nestCard,
    1
  );

  nestCard.classList.add(
    "is-stage-back"
  );

  nestCard.style.pointerEvents=
    "auto";

  nestCard.addEventListener(
    "click",
    handleNestCardBack
  );

  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      if(!memoriesCard){
        return;
      }

      memoriesCard.classList.add(
        "is-visible"
      );
    });
  });
}

/*   handle memory chapter*/
function handleMemoryChapter(chapter){
  if(chapter!=="today"){
    return false;
  }

  openTodayStage();

  return true;
}

/*   open today stage*/
function openTodayStage(){
  if(
    todayOpen||
    !currentCarousel||
    !memoriesCard
  ){
    return;
  }

  if(todayCloseTimer){
    clearTimeout(todayCloseTimer);
    todayCloseTimer=null;
  }

  todayOpen=true;

  todayCard=
    createMemoryTodayCard();

  currentCarousel.appendChild(
    todayCard
  );

  void todayCard.offsetWidth;

  /*   move nest further back*/
  if(currentNestCard){
    currentNestCard.classList.remove(
      "is-stage-back"
    );

    currentNestCard.style.pointerEvents=
      "none";

    renderCardOffset(
      currentNestCard,
      2
    );
  }

  /*   memories becomes previous level*/
  renderCardOffset(
    memoriesCard,
    1
  );

  memoriesCard.classList.add(
    "is-stage-back"
  );

  memoriesCard.style.pointerEvents=
    "auto";

  const memoriesContent=
    memoriesCard.querySelector(
      ".memories-stage-card"
    );

  if(memoriesContent){
    memoriesContent.style.pointerEvents=
      "none";
  }

  memoriesCard.addEventListener(
    "click",
    handleMemoriesCardBack
  );

  /*   reveal today*/
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      if(!todayCard){
        return;
      }

      todayCard.classList.add(
        "is-visible"
      );
    });
  });
}

/*   memories card back*/
function handleMemoriesCardBack(event){
  event.stopPropagation();

  closeTodayStage();
}

/*   close today stage*/
function closeTodayStage(){
  if(!todayOpen){
    return;
  }

  todayOpen=false;

  const cardToRemove=
    todayCard;

  const returningMemoriesCard=
    memoriesCard;

  if(cardToRemove){
    cardToRemove.classList.remove(
      "is-visible"
    );

    cardToRemove.classList.add(
      "is-leaving"
    );

    cardToRemove.style.pointerEvents=
      "none";
  }

  if(returningMemoriesCard){
    returningMemoriesCard.removeEventListener(
      "click",
      handleMemoriesCardBack
    );

    returningMemoriesCard.classList.remove(
      "is-stage-back"
    );

    returningMemoriesCard.classList.add(
      "is-returning-front"
    );

    returningMemoriesCard.style.pointerEvents=
      "none";
  }

  /*   nest returns to previous-card position*/
  if(currentNestCard){
    renderCardOffset(
      currentNestCard,
      1
    );

    currentNestCard.classList.add(
      "is-stage-back"
    );

    currentNestCard.style.pointerEvents=
      "auto";
  }

  /*   memories glides back to center*/
  todayCloseTimer=
    window.setTimeout(
      ()=>{
        todayCloseTimer=null;

        if(returningMemoriesCard){
          renderCardOffset(
            returningMemoriesCard,
            0
          );
        }
      },
      110
    );

  /*   remove today after fade*/
  window.setTimeout(
    ()=>{
      if(
        cardToRemove&&
        cardToRemove.parentNode
      ){
        cardToRemove.remove();
      }

      if(todayCard===cardToRemove){
        todayCard=null;
      }
    },
    1050
  );

  /*   restore memories interactions*/
  window.setTimeout(
    ()=>{
      if(!returningMemoriesCard){
        return;
      }

      returningMemoriesCard.classList.remove(
        "is-returning-front"
      );

      returningMemoriesCard.style.pointerEvents=
        "auto";

      const memoriesContent=
        returningMemoriesCard.querySelector(
          ".memories-stage-card"
        );

      if(memoriesContent){
        memoriesContent.style.pointerEvents=
          "";
      }
    },
    1700
  );
}

/*   previous nest card tap*/
function handleNestCardBack(event){
  event.stopPropagation();

  if(todayOpen){
    return;
  }

  closeMemoriesStage({
    nestCard:
      currentNestCard
  });
}

/*   close memories stage*/
export function closeMemoriesStage({
  nestCard
}={}){
  if(
    !memoriesOpen||
    todayOpen
  ){
    return;
  }

  memoriesOpen=false;

  const cardToRemove=
    memoriesCard;

  const previousNestCard=
    nestCard||
    currentNestCard;

  if(cardToRemove){
    cardToRemove.classList.remove(
      "is-visible"
    );

    cardToRemove.classList.add(
      "is-leaving"
    );

    cardToRemove.style.pointerEvents=
      "none";
  }

  if(previousNestCard){
    previousNestCard.removeEventListener(
      "click",
      handleNestCardBack
    );

    previousNestCard.classList.remove(
      "is-stage-back"
    );

    previousNestCard.classList.add(
      "is-returning-front"
    );

    previousNestCard.style.pointerEvents=
      "none";
  }

  closeTimer=
    window.setTimeout(
      ()=>{
        closeTimer=null;

        if(previousNestCard){
          renderCardOffset(
            previousNestCard,
            0
          );
        }
      },
      110
    );

  window.setTimeout(
    ()=>{
      if(
        cardToRemove&&
        cardToRemove.parentNode
      ){
        cardToRemove.remove();
      }
    },
    1050
  );

  window.setTimeout(
    ()=>{
      if(previousNestCard){
        previousNestCard.classList.remove(
          "is-returning-front"
        );

        previousNestCard.style.pointerEvents=
          "auto";
      }
    },
    1700
  );

  memoriesCard=null;
  currentNestCard=null;
  currentCarousel=null;
}

/*   memories state*/
export function isMemoriesStageOpen(){
  return memoriesOpen;
}

/*   today state*/
export function isMemoryTodayStageOpen(){
  return todayOpen;
}
