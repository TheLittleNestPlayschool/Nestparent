const appRoot =
  document.getElementById(
    "app"
  );


const arrivalScreen =
  document.getElementById(
    "arrivalScreen"
  );


const arrivalGreeting =
  document.getElementById(
    "arrivalGreeting"
  );


const arrivalMessage =
  document.getElementById(
    "arrivalMessage"
  );


let arrivalDone =
  false;


let arrivalTimer =
  null;


/* ==================================================
   SYNC ARRIVAL COPY
   ================================================== */

function syncArrivalCopy(){

  const greeting =
    document
      .getElementById(
        "timeGreeting"
      )
      ?.textContent
    ||
    "Good morning, Mom";


  const message =
    document
      .getElementById(
        "timeMessage"
      )
      ?.textContent
    ||
    "Mia's morning is waiting for you.";


  if(arrivalGreeting){

    arrivalGreeting.textContent =
      greeting;

  }


  if(arrivalMessage){

    arrivalMessage.textContent =
      message;

  }

}


/* ==================================================
   ENTER PARENT WORLD
   ================================================== */

function enterParentWorld(){

  if(arrivalDone){
    return;
  }


  arrivalDone =
    true;


  if(arrivalTimer){

    clearTimeout(
      arrivalTimer
    );


    arrivalTimer =
      null;

  }


  if(appRoot){

    appRoot.classList.add(
      "is-ready"
    );

  }


  window.setTimeout(
    ()=>{

      if(arrivalScreen){

        arrivalScreen.setAttribute(
          "aria-hidden",
          "true"
        );

      }

    },
    1200
  );

}


/* ==================================================
   START ARRIVAL
   ================================================== */

export function activateArrival(){

  if(
    !appRoot
    ||
    !arrivalScreen
  ){
    return;
  }


  syncArrivalCopy();


  arrivalTimer =
    window.setTimeout(
      enterParentWorld,
      3200
    );


  arrivalScreen.addEventListener(
    "pointerup",
    enterParentWorld,
    {
      passive:true
    }
  );

}
