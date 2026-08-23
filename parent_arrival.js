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


/*   sync arrival copy*/

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


/*   stop opening breath*/

function stopArrivalBreath(){

  if(
    !arrivalCopy
  ){
    return;
  }


  const animations =
    arrivalCopy.getAnimations();


  animations.forEach(
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


  const animation =
    arrivalCopy.animate(
      [
        {
          transform:
            "translateY(-2vh) scale(1)"
        },

        {
          transform:
            "translateY(-2vh) scale(1.018)"
        },

        {
          transform:
            "translateY(-2vh) scale(1)"
        }
      ],
      {
        duration:260,

        easing:
          "cubic-bezier(.22,.72,.18,1)"
      }
    );


  return animation.finished
    .catch(
      ()=>{}
    );

}


/*   curved text movement*/

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


  const finalScale =
    sourceRect.height > 0
      ?
        targetRect.height /
        sourceRect.height
      :
        1;


  const curveRight =
    Math.min(
      64,
      window.innerWidth *
      .10
    );


  const firstX =
    curveRight;


  const firstY =
    moveY *
    .22;


  const secondX =
    moveX *
    .46
    +
    curveRight *
    .55;


  const secondY =
    moveY *
    .62;


  const thirdX =
    moveX *
    .82
    +
    curveRight *
    .12;


  const thirdY =
    moveY *
    .88;


  const firstScale =
    1 +
    (
      finalScale -
      1
    )
    *
    .20;


  const secondScale =
    1 +
    (
      finalScale -
      1
    )
    *
    .58;


  const thirdScale =
    1 +
    (
      finalScale -
      1
    )
    *
    .86;


  return source.animate(
    [
      {
        offset:0,

        transform:
          `
            translate3d(
              0,
              0,
              0
            )
            scale(1)
          `
      },

      {
        offset:.24,

        transform:
          `
            translate3d(
              ${firstX}px,
              ${firstY}px,
              0
            )
            scale(${firstScale})
          `
      },

      {
        offset:.57,

        transform:
          `
            translate3d(
              ${secondX}px,
              ${secondY}px,
              0
            )
            scale(${secondScale})
          `
      },

      {
        offset:.82,

        transform:
          `
            translate3d(
              ${thirdX}px,
              ${thirdY}px,
              0
            )
            scale(${thirdScale})
          `
      },

      {
        offset:1,

        transform:
          `
            translate3d(
              ${moveX}px,
              ${moveY}px,
              0
            )
            scale(${finalScale})
          `
      }
    ],
    {
      duration:
        options.duration
        ??
        2500,

      delay:
        options.delay
        ??
        0,

      easing:
        "cubic-bezier(.20,.68,.18,1)",

      fill:
        "forwards"
    }
  );

}


/*   begin curved morph*/

function beginMorph(){

  appRoot.classList.add(
    "is-entering"
  );


  requestAnimationFrame(
    ()=>{

      requestAnimationFrame(
        ()=>{

          const animations = [

            moveTextToTarget(
              arrivalEyebrow,
              headerEyebrow,
              {
                duration:2450,
                delay:0
              }
            ),

            moveTextToTarget(
              arrivalGreeting,
              headerGreeting,
              {
                duration:2500,
                delay:35
              }
            ),

            moveTextToTarget(
              arrivalMessage,
              headerMessage,
              {
                duration:2550,
                delay:70
              }
            )

          ].filter(
            Boolean
          );


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


/*   enter parent world*/

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


  arrivalScreen.addEventListener(
    "pointerup",
    enterParentWorld,
    {
      passive:true
    }
  );

}
