import {
  openMemoriesStage,
  closeMemoriesStage,
  isMemoriesStageOpen
} from "./parent_memories_stage.js";

import {
  openMemoryArchiveStage,
  closeMemoryArchiveStage,
  isMemoryArchiveOpen
} from "./parent_memory_archive_stage.js";

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

  if(!nestCard){
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

/*   open earlier memories*/

function openEarlierMemories(){
  if(
    !carousel
    ||
    !isMemoriesStageOpen()
    ||
    isMemoryArchiveOpen()
  ){
    return;
  }

  const memoriesCard =
    carousel.querySelector(
      ".memories-experience"
    );

  if(!memoriesCard){
    return;
  }

  openMemoryArchiveStage({
    carousel,
    memoriesCard
  });
}

/*   close earlier memories*/

export function closeEarlierMemories(){
  if(
    !isMemoryArchiveOpen()
  ){
    return;
  }

  const memoriesCard =
    carousel?.querySelector(
      ".memories-experience"
    );

  closeMemoryArchiveStage({
    memoriesCard
  });
}

/*   route nest destination*/

function routeDestination(
  event
){
  const destination =
    event.detail
      ?.destination;

  if(!destination){
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

/*   route memory chapter*/

function routeMemoryChapter(
  event
){
  const chapter =
    event.detail
      ?.chapter;

  if(!chapter){
    return;
  }

  if(
    chapter ===
    "earlier"
  ){
    openEarlierMemories();
    return;
  }

  /*
    Today, This Week and August
    will be connected to their
    memory collections next.
  */
}

/*   route special collection*/

function routeMemoryCollection(
  event
){
  const collection =
    event.detail
      ?.collection;

  if(!collection){
    return;
  }

  /*
    Recognition Days and Birthdays
    will be connected next.
  */

  console.log(
    "Memory collection:",
    collection
  );
}

/*   activate stage router*/

export function activateStageRouter(){
  window.addEventListener(
    "parent:nest-destination",
    routeDestination
  );

  window.addEventListener(
    "parent:memory-chapter",
    routeMemoryChapter
  );

  window.addEventListener(
    "parent:memory-collection",
    routeMemoryCollection
  );
}
