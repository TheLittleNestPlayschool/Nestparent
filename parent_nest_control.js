import {
  openNestStage,
  closeNestStage,
  isNestStageOpen
} from "./parent_carousel.js";


const nestOrb =
  document.getElementById(
    "nestOrb"
  );


let nestBusy =
  false;


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


  window.setTimeout(
    ()=>{

      nestBusy =
        false;

    },
    1300
  );

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


  window.setTimeout(
    ()=>{

      nestBusy =
        false;

    },
    1300
  );

}


/*   toggle nest*/

function toggleNest(){

  if(
    isNestStageOpen()
  ){

    closeNest();

    return;

  }


  openNest();

}


/*   destination events*/

function handleDestination(
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


  /*
    Destinations intentionally do nothing
    beyond identifying themselves for now.

    Their individual experiences will be
    connected next.
  */

  console.log(
    "Nest destination:",
    destination
  );

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
    toggleNest
  );


  window.addEventListener(
    "parent:nest-destination",
    handleDestination
  );

}
