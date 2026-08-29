import{
  createMemoryViewerCard
}from"./parent_memory_viewer_card.js";

import{
  renderCardOffset
}from"./parent_card_positions.js";

let viewerOpen=false;
let viewerCard=null;
let viewerCloseTimer=null;

/*   open memory viewer stage*/
export function openMemoryViewerStage({
  carousel,
  nestCard,
  memoriesCard,
  collectionCard,
  mediaItems,
  index,
  collection
}){
  if(
    viewerOpen||
    !carousel||
    !collectionCard
  ){
    return false;
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
      activeIndex:index,
      collection
    });

  carousel.appendChild(
    viewerCard
  );

  void viewerCard.offsetWidth;

  /*   nest moves further back*/
  if(nestCard){
    nestCard.classList.remove(
      "is-stage-back"
    );

    renderCardOffset(
      nestCard,
      3
    );

    nestCard.style.pointerEvents=
      "none";
  }

  /*   memories moves further back*/
  if(memoriesCard){
    memoriesCard.classList.remove(
      "is-stage-back"
    );

    renderCardOffset(
      memoriesCard,
      2
    );

    memoriesCard.style.pointerEvents=
      "none";
  }

  /*   collection becomes previous level*/
  collectionCard.classList.add(
    "is-stage-back"
  );

  renderCardOffset(
    collectionCard,
    1
  );

  collectionCard.style.pointerEvents=
    "auto";

  /*   viewer enters*/
  renderCardOffset(
    viewerCard,
    0
  );

  requestAnimationFrame(
    ()=>{
      requestAnimationFrame(
        ()=>{
          viewerCard.classList.add(
            "is-visible"
          );
        }
      );
    }
  );

  return true;
}

/*   close memory viewer stage*/
export function closeMemoryViewerStage({
  nestCard,
  memoriesCard,
  collectionCard
}={}){
  if(!viewerOpen){
    return false;
  }

  viewerOpen=false;

  const cardToRemove=
    viewerCard;

  viewerCard=null;

  if(cardToRemove){
    cardToRemove.classList.remove(
      "is-visible"
    );

    cardToRemove.classList.add(
      "is-leaving"
    );
  }

  /*   collection returns to center*/
  if(collectionCard){
    collectionCard.classList.remove(
      "is-stage-back"
    );

    renderCardOffset(
      collectionCard,
      0
    );

    collectionCard.style.pointerEvents=
      "auto";
  }

  /*   memories becomes back level*/
  if(memoriesCard){
    memoriesCard.classList.add(
      "is-stage-back"
    );

    renderCardOffset(
      memoriesCard,
      1
    );

    memoriesCard.style.pointerEvents=
      "auto";
  }

  /*   nest returns behind memories*/
  if(nestCard){
    nestCard.classList.remove(
      "is-stage-back"
    );

    renderCardOffset(
      nestCard,
      2
    );

    nestCard.style.pointerEvents=
      "none";
  }

  viewerCloseTimer=
    window.setTimeout(
      ()=>{
        if(cardToRemove){
          cardToRemove.remove();
        }

        viewerCloseTimer=null;
      },
      700
    );

  return true;
}

/*   viewer stage open*/
export function isMemoryViewerStageOpen(){
  return viewerOpen;
}
