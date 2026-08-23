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


let starsContainer =
  null;


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


/*   create stars*/

function createArrivalStars(){

  if(
    !arrivalScreen
  ){
    return;
  }


  starsContainer =
    document.createElement(
      "div"
    );


  starsContainer.className =
    "arrival-stars";


  starsContainer.setAttribute(
    "aria-hidden",
    "true"
  );


  const starPositions = [
    [11,16],
    [28,24],
    [72,15],
    [88,29],
    [16,43],
    [82,47],
    [8,67],
    [25,76],
    [74,70],
    [91,79],
    [40,12],
    [61,83],
    [14,88],
    [87,60]
  ];


  starPositions.forEach(
    (
      position,
      index
    )=>{

      const star =
        document.createElement(
          "span"
        );


      star.className =
        "arrival-star";


      if(
        index %
        3 ===
        1
      ){

        star.classList.add(
          "is-silver"
        );

      }


      const size =
        index %
        5 ===
        0
          ?
            3
          :
          index %
          3 ===
          0
            ?
              2
            :
              1.5;


      const opacity =
        .42
        +
        (
          index %
          4
        )
        *
        .11;


      const speed =
        2600
        +
        (
          index %
          5
        )
        *
        570;


      const delay =
        (
          index %
          7
        )
        *
        -430;


      const leaveDelay =
        (
          index *
          83
        )
        %
        620;


      star.style.setProperty(
        "--star-x",
        `${position[0]}%`
      );


      star.style.setProperty(
        "--star-y",
        `${position[1]}%`
      );


      star.style.setProperty(
        "--star-size",
        `${size}px`
      );


      star.style.setProperty(
        "--star-opacity",
        opacity
      );


      star.style.setProperty(
        "--star-speed",
        `${speed}ms`
      );


      star.style.setProperty(
        "--star-delay",
        `${delay}ms`
      );


      star.style.setProperty(
        "--leave-delay",
        `${leaveDelay}ms`
      );


      starsContainer.appendChild(
        star
      );

    }
  );


  arrivalScreen.insertBefore(
    starsContainer,
    arrivalCopy
  );

}


/*   remove stars*/

function releaseArrivalStars(){

  if(
    !starsContainer
  ){
    return;
  }


  starsContainer.classList.add(
    "is-leaving"
  );


  window.setTimeout(
    ()=>{

      if(
        starsContainer
      ){

        starsContainer.remove();

        starsContainer =
          null;

      }

    },
    1650
  );

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

        fill:
          "forwards"
      }
    );


  return animation.finished
    .catch(
      ()=>{}
    );

}


/*   quadratic curve point*/

function getCurvePoint(
  start,
  control,
  end,
  amount
){

  const inverse =
    1 -
    amount;


  return {

    x:
      inverse *
      inverse *
      start.x
      +
      2 *
      inverse *
      amount *
      control.x
      +
      amount *
      amount *
      end.x,

    y:
      inverse *
      inverse *
      start.y
      +
      2 *
      inverse *
      amount *
      control.y
      +
      amount *
      amount *
      end.y

  };

}


/*   smooth scale*/

function getScaleAtPoint(
  finalScale,
  amount
){

  const smoothAmount =
    amount *
    amount *
    (
      3 -
      2 *
      amount
    );


  return (
    1
    +
    (
      finalScale -
      1
    )
    *
    smoothAmount
  );

}


/*   build flowing curve*/

function buildCurveFrames(
  moveX,
  moveY,
  finalScale
){

  const start = {
    x:0,
    y:0
  };


  const end = {
    x:moveX,
    y:moveY
  };


  const rightDrift =
    Math.min(
      78,
      window.innerWidth *
      .12
    );


  const control = {
    x:rightDrift,
    y:moveY * .48
  };


  const frames = [];


  const steps =
    18;


  for(
    let step = 0;
    step <= steps;
    step++
  ){

    const amount =
      step /
      steps;


    const point =
      getCurvePoint(
        start,
        control,
        end,
        amount
      );


    const scale =
      getScaleAtPoint(
        finalScale,
        amount
      );


    frames.push(
      {
        offset:amount,

        transform:
          `
            translate3d(
              ${point.x}px,
              ${point.y}px,
              0
            )
            scale(${scale})
          `
      }
    );

  }


  return frames;

}


/*   curved text movement*/

function moveTextToTarget(
  source,
  target
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
    sourceRect.height >
    0
      ?
        targetRect.height /
        sourceRect.height
      :
        1;


  const frames =
    buildCurveFrames(
      moveX,
      moveY,
      finalScale
    );


  return source.animate(
    frames,
    {
      duration:3150,

      easing:
        "cubic-bezier(.20,.54,.16,1)",

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


  releaseArrivalStars();


  requestAnimationFrame(
    ()=>{

      requestAnimationFrame(
        ()=>{

          const animations = [

            moveTextToTarget(
              arrivalEyebrow,
              headerEyebrow
            ),

            moveTextToTarget(
              arrivalGreeting,
              headerGreeting
            ),

            moveTextToTarget(
              arrivalMessage,
              headerMessage
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


  createArrivalStars();


  arrivalScreen.addEventListener(
    "pointerup",
    enterParentWorld,
    {
      passive:true
    }
  );

}
