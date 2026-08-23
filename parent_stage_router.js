import {
  openMemoriesStage,
  closeMemoriesStage,
  isMemoriesStageOpen
} from "./parent_memories_stage.js";


import {
  getNestCard
} from "./parent_nest_stage.js";


const carousel =
  document.getElementById(
    "carousel"
  );


/*   open memories*/

function openMemories(){

  if(
    !carousel
    ||
    isMemoriesStageOpen()
  ){
    return;
  }


  const nestCard =
    getNestCard();


  if(
    !nestCard
  ){
    return;
  }


  openMemoriesStage({
    carousel,
    nestCard
  });

}


/*   close memories*/

export function closeMemories(){

  if(
    !carousel
    ||
    !isMemoriesStageOpen()
  ){
    return;
  }


  const nestCard =
    getNestCard();


  closeMemoriesStage({
    nestCard
  });

}


/*   route destination*/

function routeDestination(
  event
){

  const destination =
    event.detail
      ?.destination;


  if(
    !destination
  ){
    return;
  }


  if(
    destination ===
    "memories"
  ){

    openMemories();

    return;

  }


  if(
    destination ===
    "journey"
  ){

    return;

  }


  if(
    destination ===
    "together"
  ){

    return;

  }


  if(
    destination ===
    "our-nest"
  ){

    return;

  }

}


/*   activate stage router*/

export function activateStageRouter(){

  window.addEventListener(
    "parent:nest-destination",
    routeDestination
  );

}
