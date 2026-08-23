import {
  experiences
} from "./parent_experiences.js";


import {
  createNestCard
} from "./parent_nest_card.js";


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


const nestOrb =
  document.getElementById(
    "nestOrb"
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


let nestOpen =
  false;


let nestCard =
  null;


/*   build cards*/

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
            nestOpen
          ){
            return;
          }


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


/*   position normal cards*/

function renderPositions(){

  const cards = [
    ...carousel.querySelectorAll(
      ".experience:not(.nest-experience)"
    )
  ];


  cards.forEach(
    (
      card,
      index
    )=>{

      if(
        nestOpen
      ){

        renderNestPosition(
          card,
          index
        );

        return;
      }


      const offset =
        index -
        activeIndex;


      renderCardOffset(
        card,
        offset
      );

    }
  );

}


/*   nest mode positions*/

function renderNestPosition(
  card,
  index
){

  if(
    index <
    activeIndex
  ){

    card.style.opacity =
      "0";


    card.style.pointerEvents =
      "none";


    card.style.filter =
      "blur(8px)";


    card.style.transform = `
      translate(-50%,-50%)
      translateX(-55%)
      scale(.76)
    `;


    return;
  }


  const offset =
    index -
    activeIndex +
    1;


  renderCardOffset(
    card,
    offset
  );

}


/*   render card offset*/

function renderCardOffset(
  card,
  offset
){

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
    offset ===
    0
      ?
        1
      :
        .86;


  const rotate =
    offset *
    -2.6;


  const z =
    offset ===
    0
      ?
        0
      :
        -90;


  const y =
    Math.abs(
      offset
    )
    *
    10;


  const opacity =
    offset ===
    0
      ?
        1
      :
        .46;


  card.style.opacity =
    opacity;


  card.style.pointerEvents =
    offset ===
    0
      ?
        "auto"
      :
        "none";


  card.style.filter =
    offset ===
    0
      ?
        "blur(0px)"
      :
        "blur(1.4px)";


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


/*   open nest card*/

function openNestCard(){

  if(
    nestOpen
    ||
    !carousel
  ){
    return;
  }


  nestOpen =
    true;


  hideHint();


  if(
    nestOrb
  ){

    nestOrb.classList.add(
      "is-open"
    );

  }


  renderPositions();


  nestCard =
    createNestCard();


  carousel.appendChild(
    nestCard
  );


  requestAnimationFrame(
    ()=>{

      requestAnimationFrame(
        ()=>{

          if(
            nestCard
          ){

            nestCard.classList.add(
              "is-visible"
            );

          }

        }
      );

    }
  );

}


/*   move*/

function move(
  direction
){

  if(
    nestOpen
  ){
    return;
  }


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


/*   hint*/

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


/*   pointer down*/

function pointerDown(
  event
){

  if(
    nestOpen
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


/*   activate carousel*/

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


  if(
    nestOrb
  ){

    nestOrb.addEventListener(
      "click",
      openNestCard
    );

  }

}
