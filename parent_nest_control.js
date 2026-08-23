import {
  openNestStage,
  closeNestStage,
  isNestStageOpen
} from "./parent_carousel.js";

import {
  isMemoriesStageOpen
} from "./parent_memories_stage.js";

import {
  isMemoryArchiveOpen
} from "./parent_memory_archive_stage.js";

import {
  closeMemories,
  closeEarlierMemories
} from "./parent_stage_router.js";

const nestOrb =
  document.getElementById(
    "nestOrb"
  );

let nestBusy =
  false;

/*   release busy state*/

function releaseBusy(
  delay=420
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

  if(nestOrb){
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

  if(nestOrb){
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

/*   return from archive*/

function returnFromArchive(){
  if(
    nestBusy
    ||
    !isMemoryArchiveOpen()
  ){
    return;
  }

  nestBusy =
    true;

  closeEarlierMemories();

  /*
    Let Memories return first.
    Then continue back to the Nest.
  */

  window.setTimeout(
    ()=>{
      closeMemories();
    },
    720
  );

  releaseBusy(
    1850
  );
}

/*   handle orb*/

function handleNestOrb(){
  if(
    isMemoryArchiveOpen()
  ){
    returnFromArchive();
    return;
  }

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
  if(!nestOrb){
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
