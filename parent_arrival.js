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


let arrivalTimer =
  null;


/* ==================================================
   SYNC ARRIVAL COPY
   ================================================== */

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


/* ==================================================
   CREATE TEXT MOVE
   ================================================== */

function moveTextToTarget(
  source,
  target,
  options={}
){

  if(
    !source
    ||
    !target
  ){
    return null;
  }


  const sourceRect =
    source.getBoundingClientRect();


  const targetRect =
    target.getBoundingClientRect();


  const moveX =
    targetRect.left -
    sourceRect.left;


  const moveY =
    targetRect.top -
    sourceRect.top;


  /*
    Use the height difference to create a
    natural uniform shrink while the words
    travel toward the header.
  */

  const scale =
    sourceRect.height > 0
      ?
        targetRect.height /
        sourceRect.height
      :
        1;


  return source.animate(
    [
      {
        transform:
          "translate3d(0,0,0) scale(1)",

        opacity:1
      },

      {
        transform:
          `
            translate3d(
              ${moveX}px,
              ${moveY}px,
              0
            )
            scale(${scale})
          `,

        opacity:1
      }
    ],
    {
      duration:
        options.duration
        ??
        1900,

      delay:
        options.delay
        ??
        0,

      easing:
        "cubic-bezier(.22,.72,.18,1)",

      fill:
        "forwards"
    }
  );

}


/* ==================================================
   ENTER PARENT WORLD
   ================================================== */

function enterParentWorld(){

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


  if(arrivalTimer){

    clearTimeout(
      arrivalTimer
    );


    arrivalTimer =
      null;

  }


  /*
    Expose the final interface positions.

    Header words remain invisible because CSS
    keeps .identity at opacity 0.
  */

  appRoot.classList.add(
    "is-entering"
  );


  /*
    Wait one browser frame so the destination
    elements have their final layout positions
    before measuring them.
  */

  requestAnimationFrame(
    ()=>{

      requestAnimationFrame(
        ()=>{

          const animations = [

            moveTextToTarget(
              arrivalEyebrow,
              headerEyebrow,
              {
                duration:1900,
                delay:0
              }
            ),

            moveTextToTarget(
              arrivalGreeting,
              headerGreeting,
              {
                duration:1950,
                delay:35
              }
            ),

            moveTextToTarget(
              arrivalMessage,
              headerMessage,
              {
                duration:2000,
                delay:70
              }
            )

          ].filter(
            Boolean
          );


          /*
            Wait until every part of the greeting
            has physically arrived at its final
            destination.
          */

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

                /*
                  The moving copy is now directly
                  over the permanent header.

                  Swap them on the same frame.
                */

                appRoot.classList.add(
                  "is-ready"
                );


                arrivalScreen.setAttribute(
                  "aria-hidden",
                  "true"
                );


                /*
                  Clean up animation transforms
                  after the arrival screen is gone.
                */

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


  /*
    Give the parent time to simply arrive
    before anything starts moving.
  */

  arrivalTimer =
    window.setTimeout(
      enterParentWorld,
      3200
    );


  /*
    Tapping lets them enter immediately.
  */

  arrivalScreen.addEventListener(
    "pointerup",
    enterParentWorld,
    {
      passive:true
    }
  );

}
