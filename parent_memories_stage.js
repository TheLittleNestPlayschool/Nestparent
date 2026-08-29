import{
  createMemoriesCard
}from"./parent_memories_card.js";

import{
  createMemoryCollectionCard
}from"./parent_memory_collection_card.js";

import{
  createMemoryViewerCard
}from"./parent_memory_viewer_card.js";

import{
  renderCardOffset
}from"./parent_card_positions.js";

let memoriesOpen=false;
let memoriesCard=null;
let currentNestCard=null;
let currentCarousel=null;
let closeTimer=null;

let collectionOpen=false;
let collectionCard=null;
let collectionCloseTimer=null;

let viewerOpen=false;
let viewerCard=null;
let viewerCloseTimer=null;

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
    clearTimeout(
      closeTimer
    );

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
function handleMemoryChapter(
  chapter
){
  if(
    chapter==="today"||
    chapter==="week"||
    chapter==="august"
  ){
    openCollectionStage(
      chapter
    );

    return true;
  }

  return false;
}

/*   open collection stage*/
function openCollectionStage(
  chapter="today"
){
  if(
    collectionOpen||
    !currentCarousel||
    !memoriesCard
  ){
    return;
  }

  if(collectionCloseTimer){
    clearTimeout(
      collectionCloseTimer
    );

    collectionCloseTimer=null;
  }

  collectionOpen=true;

  const collection=
    chapter==="week"
      ?"week"
      :chapter==="august"
        ?"month"
        :"today";

  collectionCard=
    createMemoryCollectionCard(
      collection,
      {
        onMedia:
          handleCollectionMedia
      }
    );

  currentCarousel.appendChild(
    collectionCard
  );

  void collectionCard.offsetWidth;

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

  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      if(!collectionCard){
        return;
      }

      collectionCard.classList.add(
        "is-visible"
      );
    });
  });
}

/*   collection media*/
function handleCollectionMedia(
  payload
){
  openViewerStage(
    payload
  );

  return true;
}

/*   open viewer stage*/
function openViewerStage({
  mediaItems,
  index,
  collection
}){
  if(
    viewerOpen||
    !currentCarousel||
    !collectionCard
  ){
    return;
  }

  if(viewerCloseTimer){
    clearTimeout(
      viewerCloseTimer
    );

    viewerCloseTimer=null;
  }

  viewerOpen=true;

  viewerCard=
    createMemoryViewerCard({
      mediaItems,
      activeIndex:
        index,
      collection
    });

  currentCarousel.appendChild(
    viewerCard
  );

  void viewerCard.offsetWidth;

  /*   nest moves out behind stack*/
  if(currentNestCard){
    currentNestCard.style.pointerEvents=
      "none";

    renderCardOffset(
      currentNestCard,
      3
    );
  }

  /*   memories moves another level back*/
  if(memoriesCard){
    memoriesCard.classList.remove(
      "is-stage-back"
    );

    memoriesCard.style.pointerEvents=
      "none";

    renderCardOffset(
      memoriesCard,
      2
    );
  }

  /*   collection becomes back card*/
  renderCardOffset(
    collectionCard,
    1
  );

  collectionCard.classList.add(
    "is-stage-back"
  );

  collectionCard.style.pointerEvents=
    "auto";

  const collectionContent=
    collectionCard.querySelector(
      ".memory-today-stage-card"
    );

  if(collectionContent){
    collectionContent.style.pointerEvents=
      "none";
  }

  collectionCard.addEventListener(
    "click",
    handleCollectionCardBack
  );

  /*   reveal viewer*/
  requestAnimationFrame(()=>{
    requestAnimationFrame(()=>{
      if(!viewerCard){
        return;
      }

      viewerCard.classList.add(
        "is-visible"
      );
    });
  });
}

/*   collection back from viewer*/
function handleCollectionCardBack(
  event
){
  event.stopPropagation();

  closeViewerStage();
}

/*   close viewer stage*/
function closeViewerStage(){
  if(!viewerOpen){
    return;
  }

  viewerOpen=false;

  const cardToRemove=
    viewerCard;

  const returningCollectionCard=
    collectionCard;

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

  if(returningCollectionCard){
    returningCollectionCard.removeEventListener(
      "click",
      handleCollectionCardBack
    );

    returningCollectionCard.classList.remove(
      "is-stage-back"
    );

    returningCollectionCard.classList.add(
      "is-returning-front"
    );

    returningCollectionCard.style.pointerEvents=
      "none";
  }

  /*   nest returns to collection depth*/
  if(currentNestCard){
    renderCardOffset(
      currentNestCard,
      2
    );

    currentNestCard.style.pointerEvents=
      "none";
  }

  /*   memories becomes previous level again*/
  if(memoriesCard){
    renderCardOffset(
      memoriesCard,
      1
    );

    memoriesCard.classList.add(
      "is-stage-back"
    );

    memoriesCard.style.pointerEvents=
      "auto";
  }

  /*   collection returns to center*/
  viewerCloseTimer=
    window.setTimeout(
      ()=>{
        viewerCloseTimer=null;

        if(returningCollectionCard){
          renderCardOffset(
            returningCollectionCard,
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

      if(
        viewerCard===
        cardToRemove
      ){
        viewerCard=null;
      }
    },
    1050
  );

  window.setTimeout(
    ()=>{
      if(!returningCollectionCard){
        return;
      }

      returningCollectionCard.classList.remove(
        "is-returning-front"
      );

      returningCollectionCard.style.pointerEvents=
        "auto";

      const collectionContent=
        returningCollectionCard.querySelector(
          ".memory-today-stage-card"
        );

      if(collectionContent){
        collectionContent.style.pointerEvents=
          "";
      }
    },
    1700
  );
}

/*   memories card back*/
function handleMemoriesCardBack(
  event
){
  event.stopPropagation();

  if(viewerOpen){
    return;
  }

  closeCollectionStage();
}

/*   close collection stage*/
function closeCollectionStage(){
  if(
    !collectionOpen||
    viewerOpen
  ){
    return;
  }

  collectionOpen=false;

  const cardToRemove=
    collectionCard;

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

  collectionCloseTimer=
    window.setTimeout(
      ()=>{
        collectionCloseTimer=null;

        if(returningMemoriesCard){
          renderCardOffset(
            returningMemoriesCard,
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

      if(
        collectionCard===
        cardToRemove
      ){
        collectionCard=null;
      }
    },
    1050
  );

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
function handleNestCardBack(
  event
){
  event.stopPropagation();

  if(
    collectionOpen||
    viewerOpen
  ){
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
    collectionOpen||
    viewerOpen
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

/*   collection state*/
export function isMemoryCollectionStageOpen(){
  return collectionOpen;
}

/*   viewer state*/
export function isMemoryViewerStageOpen(){
  return viewerOpen;
}
