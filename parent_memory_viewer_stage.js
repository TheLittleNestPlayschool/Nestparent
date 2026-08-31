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

  const returningCollectionCard=
    collectionCard;

  viewerCard=null;

  /*   outgoing viewer fades underneath*/
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

  /*   collection becomes foreground return card*/
  if(returningCollectionCard){
    returningCollectionCard.classList.remove(
      "is-stage-back"
    );

    returningCollectionCard.classList.add(
      "is-returning-front"
    );

    returningCollectionCard.style.pointerEvents=
      "none";
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

  /*   begin collection return glide*/
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

  /*   remove outgoing viewer*/
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

  /*   release collection after glide*/
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
    },
    1700
  );

  return true;
}

/*   viewer stage open*/
export function isMemoryViewerStageOpen(){
  return viewerOpen;
}
