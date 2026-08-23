import {
  openNestStage,
  closeNestStage,
  isNestStageOpen
} from "./parent_carousel.js";


import {
  isMemoriesStageOpen
} from "./parent_memories_stage.js";


import {
  closeMemories
} from "./parent_stage_router.js";


const nestOrb =
  document.getElementById(
    "nestOrb"
  );


let nestBusy =
  false;


/*   release busy state*/

function releaseBusy(){

  window.setTimeout(
    ()=>{

      nestBusy =
        false;

    },
    420
  );

}


/*   open nest*/

function openNest(){

  if(
    nestBusy
    ||
    isNestStageOpen()
  ){
    return;
  }


  nestBusy =
    true;


  if(
    nestOrb
  ){

    nestOrb.classList.add(
      "is-open"
    );

  }


  openNestStage();


  releaseBusy();

}


/*   close nest*/

function closeNest(){

  if(
    nestBusy
    ||
    !isNestStageOpen()
  ){
    return;
  }


  nestBusy =
    true;


  if(
    nestOrb
  ){

    nestOrb.classList.remove(
      "is-open"
    );

  }


  closeNestStage();


  releaseBusy();

}


/*   return from memories*/

function returnFromMemories(){

  if(
    nestBusy
    ||
    !isMemoriesStageOpen()
  ){
    return;
  }


  nestBusy =
    true;


  closeMemories();


  releaseBusy();

}


/*   handle orb*/

function handleNestOrb(){

  if(
    isMemoriesStageOpen()
  ){

    returnFromMemories();

    return;

  }


  if(
    isNestStageOpen()
  ){

    closeNest();

    return;

  }


  openNest();

}


/*   handle main stage return*/

function handleMainStageReturn(){

  if(
    !isNestStageOpen()
  ){
    return;
  }


  closeNest();

}


/*   activate nest control*/

export function activateNestControl(){

  if(
    !nestOrb
  ){
    return;
  }


  nestOrb.addEventListener(
    "click",
    handleNestOrb
  );


  window.addEventListener(
    "parent:return-main-stage",
    handleMainStageReturn
  );

}
