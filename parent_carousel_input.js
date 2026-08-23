/*   activate carousel input*/

export function activateCarouselInput({
  carousel,
  deepSheet,
  canMove,
  onMove
}){

  if(
    !carousel
  ){
    return;
  }


  let startX =
    0;


  let deltaX =
    0;


  let dragging =
    false;


  /*   pointer down*/

  function pointerDown(
    event
  ){

    if(
      typeof canMove ===
      "function"
      &&
      !canMove()
    ){
      return;
    }


    if(
      deepSheet
      &&
      deepSheet
        .classList
        .contains(
          "open"
        )
    ){
      return;
    }


    dragging =
      true;


    startX =
      event.clientX
      ??
      event
        .touches?.[0]
        ?.clientX
      ??
      0;


    deltaX =
      0;

  }


  /*   pointer move*/

  function pointerMove(
    event
  ){

    if(
      !dragging
    ){
      return;
    }


    const x =
      event.clientX
      ??
      event
        .touches?.[0]
        ?.clientX
      ??
      0;


    deltaX =
      x -
      startX;

  }


  /*   pointer up*/

  function pointerUp(){

    if(
      !dragging
    ){
      return;
    }


    dragging =
      false;


    if(
      deltaX <
      -52
    ){

      if(
        typeof onMove ===
        "function"
      ){

        onMove(
          1
        );

      }

    }


    else if(
      deltaX >
      52
    ){

      if(
        typeof onMove ===
        "function"
      ){

        onMove(
          -1
        );

      }

    }


    window.setTimeout(
      ()=>{

        deltaX =
          0;

      },
      0
    );

  }


  carousel.addEventListener(
    "pointerdown",
    pointerDown
  );


  window.addEventListener(
    "pointermove",
    pointerMove
  );


  window.addEventListener(
    "pointerup",
    pointerUp
  );

}
