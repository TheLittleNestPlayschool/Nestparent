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


/*   tap response*/

function playTapResponse(){

  if(
    !arrivalCopy
  ){
    return Promise.resolve();
  }


  if(
    arrivalScreen
  ){

    arrivalScreen.classList.add(
      "is-launching"
    );

  }


  const animation =
    arrivalCopy.animate(
      [
        {
          transform:
            "translateY(-2vh) scale(1)"
        },

        {
          transform:
            "translateY(-2vh) scale(1.052)"
        }
      ],
      {
        duration:340,

        easing:
          "cubic-bezier(.20,.72,.18,1)",

        fill:
          "forwards"
      }
    );


  return animation.finished
    .catch(
      ()=>{}
    );

}


/*   prepare enlarged text for morph*/

function prepareMorphState(){

  if(
    !arrivalCopy
  ){
    return;
  }


  /*
    Remove the group scale and transfer
    that enlarged feeling to the text
    elements themselves.

    This lets each line travel to its
    exact final destination independently.
  */

  arrivalCopy
    .getAnimations()
    .forEach(
      animation=>{

        animation.cancel();

      }
    );


  arrivalCopy.style.transform =
    "translateY(-2vh)";


  [
    arrivalEyebrow,
    arrivalGreeting,
    arrivalMessage
  ]
    .filter(
      Boolean
    )
    .forEach(
      element=>{

        element.style.transform =
          "scale(1.052)";

      }
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
              headerMessage,
              startScale:1.052
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


  prepareMorphState();


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
