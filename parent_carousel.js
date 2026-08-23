import {
  experiences
} from "./parent_experiences.js";


const carousel =
  document.getElementById(
    "carousel"
  );


const hint =
  document.getElementById(
    "hint"
  );


const deepSheet =
  document.getElementById(
    "deepSheet"
  );


let activeIndex =
  0;


let startX =
  0;


let deltaX =
  0;


let dragging =
  false;


let hasInteracted =
  false;


/* ==================================================
   BUILD CARDS
   ================================================== */

export function buildCards(){

  if(!carousel){
    return;
  }


  experiences.forEach(
    (
      item,
      index
    )=>{

      const article =
        document.createElement(
          "article"
        );


      article.className =
        "experience";


      article.dataset.index =
        index;


      const typeLabel =
        ({
          session:
            "Story",

          learning:
            "Learning",

          activity:
            "Activity",

          personal:
            "Growth",

          world:
            "My World",

          home:
            "Home"
        })[item.type]
        ||
        "Story";


      article.innerHTML = `
        <div class="card">

          <div
            class="photo"
            style="
              background-image:
              url('${item.photo}')
            "
          ></div>

          <div class="type-mark">
            ${typeLabel}
          </div>

          <div class="content">

            <div class="moment-label">
              ${item.label}
            </div>

            <h2 class="moment-title">
              ${item.title}
            </h2>

            <p class="moment-copy">
              ${item.copy}
            </p>

            <div class="learn-row">

              ${
                item.categories
                  .map(
                    category=>`
                      <span class="learn-pill">
                        ${category}
                      </span>
                    `
                  )
                  .join("")
              }

            </div>

          </div>

        </div>
      `;


      article.addEventListener(
        "click",
        ()=>{

          if(
            Math.abs(deltaX) <
            8
            &&
            Number(
              article.dataset.index
            )
            ===
            activeIndex
          ){

            window.dispatchEvent(
              new CustomEvent(
                "parent:open-experience",
                {
                  detail:{
                    index:
                      activeIndex
                  }
                }
              )
            );

          }

        }
      );


      carousel.appendChild(
        article
      );

    }
  );


  renderPositions();
}


/* ==================================================
   POSITION CARDS
   ================================================== */

function renderPositions(){

  const cards = [
    ...document.querySelectorAll(
      ".experience"
    )
  ];


  cards.forEach(
    (
      card,
      index
    )=>{

      const offset =
        index -
        activeIndex;


      if(
        offset < -2
        ||
        offset > 2
      ){

        card.style.opacity =
          "0";


        card.style.pointerEvents =
          "none";


        card.style.transform = `
          translate(-50%,-50%)
          translateX(
            ${offset * 64}%
          )
          scale(.74)
        `;


        card.style.filter =
          "blur(9px)";


        card.dataset.pos =
          offset;


        return;
      }


      const x =
        offset *
        73;


      const scale =
        offset === 0
          ? 1
          : .86;


      const rotate =
        offset *
        -2.6;


      const z =
        offset === 0
          ? 0
          : -90;


      const y =
        Math.abs(
          offset
        )
        *
        10;


      const opacity =
        offset === 0
          ? 1
          : .46;


      card.style.opacity =
        opacity;


      card.style.pointerEvents =
        offset === 0
          ? "auto"
          : "none";


      card.style.filter =
        offset === 0
          ? "blur(0px)"
          : "blur(1.4px)";


      card.style.transform = `
        translate(-50%,-50%)
        translate3d(
          ${x}%,
          ${y}px,
          ${z}px
        )
        rotate(
          ${rotate}deg
        )
        scale(
          ${scale}
        )
      `;


      card.style.zIndex =
        10 -
        Math.abs(
          offset
        );


      card.dataset.pos =
        offset;

    }
  );
}


/* ==================================================
   MOVE
   ================================================== */

function move(
  direction
){

  const next =
    Math.min(
      experiences.length -
      1,

      Math.max(
        0,

        activeIndex +
        direction
      )
    );


  if(
    next ===
    activeIndex
  ){
    return;
  }


  activeIndex =
    next;


  renderPositions();


  hideHint();
}


/* ==================================================
   HINT
   ================================================== */

export function hideHint(){

  if(
    hasInteracted
  ){
    return;
  }


  hasInteracted =
    true;


  if(hint){

    hint.style.opacity =
      "0";

  }

}


/* ==================================================
   POINTER DOWN
   ================================================== */

function pointerDown(
  event
){

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


/* ==================================================
   POINTER MOVE
   ================================================== */

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


/* ==================================================
   POINTER UP
   ================================================== */

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

    move(
      1
    );

  }


  else if(
    deltaX >
    52
  ){

    move(
      -1
    );

  }


  window.setTimeout(
    ()=>{

      deltaX =
        0;

    },
    0
  );
}


/* ==================================================
   ACTIVATE CAROUSEL
   ================================================== */

export function activateCarousel(){

  if(
    !carousel
  ){
    return;
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
