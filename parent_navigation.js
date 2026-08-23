const navOrb =
  document.getElementById(
    "navOrb"
  );


const navPanel =
  document.getElementById(
    "navPanel"
  );


const wash =
  document.getElementById(
    "wash"
  );


const deepSheet =
  document.getElementById(
    "deepSheet"
  );


/* ==================================================
   CLOSE NAVIGATION
   ================================================== */

function closeNavigation(){

  if(navPanel){

    navPanel.classList.remove(
      "open"
    );

  }


  if(navOrb){

    navOrb.classList.remove(
      "open"
    );

  }


  if(
    wash
    &&
    !deepSheet
      ?.classList
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
   TOGGLE NAVIGATION
   ================================================== */

function toggleNavigation(){

  if(
    !navPanel
    ||
    !navOrb
    ||
    !wash
  ){
    return;
  }


  const opening =
    !navPanel
      .classList
      .contains(
        "open"
      );


  navPanel.classList.toggle(
    "open",
    opening
  );


  navOrb.classList.toggle(
    "open",
    opening
  );


  wash.classList.toggle(
    "open",
    opening
  );


  window.dispatchEvent(
    new CustomEvent(
      "parent:navigation-used"
    )
  );

}


/* ==================================================
   NAV ITEM SELECTION
   ================================================== */

function activateNavItems(){

  const navItems =
    document.querySelectorAll(
      ".nav-item"
    );


  navItems.forEach(
    item=>{

      item.addEventListener(
        "click",
        ()=>{

          navItems.forEach(
            navItem=>{

              navItem.classList.remove(
                "active"
              );

            }
          );


          item.classList.add(
            "active"
          );


          if(
            typeof item.animate ===
            "function"
          ){

            item.animate(
              [
                {
                  transform:
                    "scale(.94)"
                },
                {
                  transform:
                    "scale(1.04)"
                },
                {
                  transform:
                    "scale(1)"
                }
              ],
              {
                duration:320,

                easing:
                  "cubic-bezier(.22,.75,.2,1)"
              }
            );

          }

        }
      );

    }
  );

}


/* ==================================================
   WASH CLICK
   ================================================== */

function activateWash(){

  if(!wash){
    return;
  }


  wash.addEventListener(
    "click",
    ()=>{

      closeNavigation();


      if(
        deepSheet
        &&
        deepSheet
          .classList
          .contains(
            "open"
          )
      ){

        window.dispatchEvent(
          new CustomEvent(
            "parent:close-sheet"
          )
        );

      }

    }
  );

}


/* ==================================================
   ACTIVATE NAVIGATION
   ================================================== */

export function activateNavigation(){

  if(navOrb){

    navOrb.addEventListener(
      "click",
      toggleNavigation
    );

  }


  activateNavItems();

  activateWash();

}
