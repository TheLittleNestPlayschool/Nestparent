import{applyTimeAtmosphere}from"./parent_time.js";
import{buildCards,activateCarousel}from"./parent_carousel.js";
import{activateSheet}from"./parent_sheet.js";
import{activateNavigation}from"./parent_navigation.js";
import{activateArrival}from"./parent_arrival.js";
import{activateNestControl}from"./parent_nest_control.js";
import{activateStageRouter}from"./parent_stage_router.js";
import{activateParentAuth}from"./parent_auth.js";

let appStarted=false;

/*   start parent app*/
function startParentApp(){
  if(appStarted) return;
  appStarted=true;

  applyTimeAtmosphere();
  buildCards();
  activateCarousel();
  activateSheet();
  activateNavigation();
  activateArrival();
  activateNestControl();
  activateStageRouter();
}

/*   authenticate then start*/
activateParentAuth(startParentApp);
