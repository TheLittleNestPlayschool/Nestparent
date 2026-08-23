let starsContainer =
  null;


/*   create stars*/

export function createArrivalStars(
  arrivalScreen,
  arrivalCopy
){

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
    [8,13],
    [20,22],
    [36,11],
    [55,18],
    [73,12],
    [90,20],

    [12,36],
    [30,31],
    [69,33],
    [87,40],

    [6,55],
    [22,62],
    [79,56],
    [93,64],

    [14,76],
    [34,82],
    [61,74],
    [84,83],

    [9,91],
    [48,91],
    [72,92]
  ];


  const featureStars =
    new Set(
      [
        0,
        5,
        10,
        13,
        18,
        20
      ]
    );


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
        "arrival-star is-ice";


      if(
        featureStars.has(
          index
        )
      ){

        star.classList.add(
          "is-feature"
        );

      }


      let size =
        3;


      if(
        featureStars.has(
          index
        )
      ){

        size =
          5.5;

      }


      else if(
        index %
        4 ===
        0
      ){

        size =
          4;

      }


      else if(
        index %
        3 ===
        0
      ){

        size =
          3.5;

      }


      const opacity =
        featureStars.has(
          index
        )
          ?
            1
          :
            .74
            +
            (
              index %
              3
            )
            *
            .09;


      const speed =
        1900
        +
        (
          index %
          6
        )
        *
        420;


      const delay =
        (
          index %
          8
        )
        *
        -340;


      const leaveDelay =
        (
          index *
          67
        )
        %
        720;


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


/*   release stars*/

export function releaseArrivalStars(){

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
    1850
  );

}
