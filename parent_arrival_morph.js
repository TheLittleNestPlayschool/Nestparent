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


/*   build curve*/

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


  const frames =
    [];


  const steps =
    18;


  for(
    let step =
      0;
    step <=
      steps;
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


/*   move text*/

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


/*   morph greeting*/

export function morphArrivalText({
  arrivalEyebrow,
  arrivalGreeting,
  arrivalMessage,
  headerEyebrow,
  headerGreeting,
  headerMessage
}){

  return [

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

}
