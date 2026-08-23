import {
  experiences
} from "./parent_experiences.js";


const deepSheet =
  document.getElementById(
    "deepSheet"
  );


const sheetTitle =
  document.getElementById(
    "sheetTitle"
  );


const sheetCopy =
  document.getElementById(
    "sheetCopy"
  );


const learningList =
  document.getElementById(
    "learningList"
  );


const sheetClose =
  document.getElementById(
    "sheetClose"
  );


const wash =
  document.getElementById(
    "wash"
  );


const navPanel =
  document.getElementById(
    "navPanel"
  );


/* ==================================================
   TITLES
   ================================================== */

const titles = {

  session:
    "What today's session contained",

  learning:
    "What was strongest today",

  activity:
    "Inside the movement activity",

  personal:
    "The personal side of today's session",

  world:
    "A quieter part of today",

  home:
    "A little bridge back home"

};


/* ==================================================
   OPEN SHEET
   ================================================== */

function openDeep(
  index
){

  const item =
    experiences[index];


  if(
    !item
    ||
    !deepSheet
  ){
    return;
  }


  sheetTitle.textContent =
    titles[item.type]
    ||
    "A little deeper";


  sheetCopy.textContent =
    item.deeper;


  learningList.innerHTML =
    item.learning
      .map(
        row=>`
          <div class="learning-item">

            <div class="learning-symbol">
              ${row[0]}
            </div>

            <div>

              <div class="learning-name">
                ${row[1]}
              </div>

              <div class="learning-detail">
                ${row[2]}
              </div>

            </div>

          </div>
        `
      )
      .join("");


  wash.classList.add(
    "open"
  );


  deepSheet.classList.add(
    "open"
  );


  deepSheet.setAttribute(
    "aria-hidden",
    "false"
  );

}


/* ==================================================
   CLOSE SHEET
   ================================================== */

export function closeDeep(){

  if(
    !deepSheet
  ){
    return;
  }


  deepSheet.classList.remove(
    "open"
  );


  deepSheet.setAttribute(
    "aria-hidden",
    "true"
  );


  if(
    !navPanel
    ||
    !navPanel
      .classList
      .contains(
        "open"
      )
  ){

    wash.classList.remove(
      "open"
    );

  }

}


/* ==================================================
   ACTIVATE SHEET
   ================================================== */

export function activateSheet(){

  window.addEventListener(
    "parent:open-experience",
    event=>{

      const index =
        event.detail?.index;


      if(
        typeof index !==
        "number"
      ){
        return;
      }


      openDeep(
        index
      );

    }
  );


  if(
    sheetClose
  ){

    sheetClose.addEventListener(
      "click",
      closeDeep
    );

  }

}
