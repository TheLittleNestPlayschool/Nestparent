import{applyTimeAtmosphere}from"./parent_time.js";
import{applyParentGreeting}from"./parent_greeting.js";
import{loadParentData}from"./parent_data.js";
import{buildCards,activateCarousel}from"./parent_carousel.js";
import{activateSheet}from"./parent_sheet.js";
import{activateNavigation}from"./parent_navigation.js";
import{activateArrival}from"./parent_arrival.js";
import{activateNestControl}from"./parent_nest_control.js";
import{activateStageRouter}from"./parent_stage_router.js";
import{activateParentAuth}from"./parent_auth.js";

let appStarted=false;

/*   start parent app*/
async function startParentApp(){
  if(appStarted) return;
  appStarted=true;

  try{
    await loadParentData();

    applyTimeAtmosphere();
    applyParentGreeting();
    buildCards();
    activateCarousel();
    activateSheet();
    activateNavigation();
    activateArrival();
    activateNestControl();
    activateStageRouter();
  }catch(error){
    appStarted=false;
    console.error(
      "Unable to start Parent App:",
      error
    );
  }
}

/*   authenticate then start*/
activateParentAuth(startParentApp);
