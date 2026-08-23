import {
  createArrivalStars,
  releaseArrivalStars
} from "./parent_arrival_stars.js";


import {
  morphArrivalText
} from "./parent_arrival_morph.js";


const appRoot =
  document.getElementById(
    "app"
  );


const arrivalScreen =
  document.getElementById(
    "arrivalScreen"
  );


const arrivalCopy =
  arrivalScreen
    ?.querySelector(
      ".arrival-copy"
    );


const arrivalEyebrow =
  arrivalScreen
    ?.querySelector(
      ".arrival-eyebrow"
    );


const arrivalGreeting =
  document.getElementById(
    "arrivalGreeting"
  );


const arrivalMessage =
  document.getElementById(
    "arrivalMessage"
  );


const headerIdentity =
  document.querySelector(
    ".topbar .identity"
  );


const headerEyebrow =
  headerIdentity
    ?.querySelector(
      ".eyebrow"
    );


const headerGreeting =
  document.getElementById(
    "timeGreeting"
  );


const headerMessage =
  document.getElementById(
    "timeMessage"
  );


let arrivalDone =
  false;


/*   sync copy*/

function syncArrivalCopy(){

  if(
    arrivalGreeting
    &&
    headerGreeting
  ){

    arrivalGreeting.textContent =
      headerGreeting.textContent;

  }


  if(
    arrivalMessage
    &&
    headerMessage
  ){

    arrivalMessage.textContent =
      headerMessage.textContent;

  }

}


/*   stop breath*/

function stopArrivalBreath(){

  if(
    !arrivalCopy
  ){
    return;
  }


  arrivalCopy
    .getAnimations()
    .forEach(
      animation=>{

        animation.cancel();

      }
    );


  arrivalCopy.style.transform =
    "translateY(-2vh)";

}


/*   tap bloom*/

function playTapBloom(){

  if(
    !arrivalScreen
  ){
    return;
  }


  arrivalScreen.classList.remove(
    "is-tapped"
  );


  void arrivalScreen.offsetWidth;


  arrivalScreen.classList.add(
    "is-tapped"
  );

}


/*   tap response*/

function playTapResponse(){

  if(
    !arrivalCopy
  ){
    return Promise.resolve();
  }


  playTapBloom();


  const animation =
    arrivalCopy.animate(
      [
        {
          offset:0,

          transform:
            "translateY(-2vh) scale(1)",

          filter:
            "brightness(1)"
        },

        {
          offset:.38,

          transform:
            "translateY(-2vh) scale(1.038)",

          filter:
            "brightness(1.035)"
        },

        {
          offset:.72,

          transform:
            "translateY(-2vh) scale(1.018)",

          filter:
            "brightness(1.018)"
        },

        {
          offset:1,

          transform:
            "translateY(-2vh) scale(1.01)",

          filter:
            "brightness(1)"
        }
      ],
      {
        duration:540,

        easing:
          "cubic-bezier(.22,.72,.18,1)",

        fill:"forwards"
      }
    );


  return animation.finished
    .catch(
      ()=>{}
    );

}


/*   begin morph*/

function beginMorph(){

  appRoot.classList.add(
    "is-entering"
  );


  releaseArrivalStars();


  requestAnimationFrame(
    ()=>{

      requestAnimationFrame(
        ()=>{

          const animations =
            morphArrivalText({
              arrivalEyebrow,
              arrivalGreeting,
              arrivalMessage,
              headerEyebrow,
              headerGreeting,
              headerMessage
            });


          Promise
            .all(
              animations.map(
                animation=>
                  animation.finished
                    .catch(
                      ()=>{}
                    )
              )
            )
            .then(
              ()=>{

                appRoot.classList.add(
                  "is-ready"
                );


                arrivalScreen.setAttribute(
                  "aria-hidden",
                  "true"
                );


                animations.forEach(
                  animation=>{

                    animation.cancel();

                  }
                );

              }
            );

        }
      );

    }
  );

}


/*   enter world*/

async function enterParentWorld(){

  if(
    arrivalDone
    ||
    !appRoot
    ||
    !arrivalScreen
  ){
    return;
  }


  arrivalDone =
    true;


  stopArrivalBreath();


  await playTapResponse();


  if(
    arrivalCopy
  ){

    arrivalCopy.style.transform =
      "translateY(-2vh) scale(1.01)";

  }


  beginMorph();

}


/*   activate arrival*/

export function activateArrival(){

  if(
    !appRoot
    ||
    !arrivalScreen
  ){
    return;
  }


  syncArrivalCopy();


  createArrivalStars(
    arrivalScreen,
    arrivalCopy
  );


  arrivalScreen.addEventListener(
    "pointerup",
    enterParentWorld,
    {
      passive:true
    }
  );

}
