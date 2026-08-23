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

function releaseBusy(
  delay=1500
){

  window.setTimeout(
    ()=>{

      nestBusy =
        false;

    },
    delay
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


  /*
    The Nest remains open.

    Only Memories leaves and the
    Nest card returns to center.
  */

  closeMemories();


  releaseBusy();

}


/*   handle orb*/

function handleNestOrb(){

  /*
    Deeper stages take priority.

    From Memories, the orb means:
    return to the Little Nest hub.
  */

  if(
    isMemoriesStageOpen()
  ){

    returnFromMemories();

    return;

  }


  /*
    From the Nest hub, the orb means:
    return to Mia's main stage.
  */

  if(
    isNestStageOpen()
  ){

    closeNest();

    return;

  }


  /*
    From Mia's main stage, the orb
    opens the Little Nest hub.
  */

  openNest();

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

}
