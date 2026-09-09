import{applyTimeAtmosphere}from"./parent_time.js";
import{applyParentGreeting}from"./parent_greeting.js";
import{loadParentData}from"./parent_data.js";
import{loadAwardsData}from"./parent_awards_data.js";
import{loadRecentAwardsData}from"./parent_recent_awards_data.js";
import{loadMomentsData}from"./parent_moments_data.js";
import{loadCelebrationData}from"./parent_celebration_data.js";
import{buildCards,activateCarousel}from"./parent_carousel.js";
import{activateSheet}from"./parent_sheet.js";
import{activateNavigation}from"./parent_navigation.js";
import{activateArrival}from"./parent_arrival.js";
import{activateNestControl}from"./parent_nest_control.js";
import{activateStageRouter}from"./parent_stage_router.js";
import{activateParentAuth}from"./parent_auth.js";
import{
  startParentAnalyticsSession,
  setParentAnalyticsContext,
  trackParentAnalyticsEvent,
  markParentAnalyticsReady
}from"./parent_analytics.js";

let appStarted=false;

/*   start parent app*/
async function startParentApp(){
  if(appStarted)return;
  appStarted=true;

  try{
    try{
      await startParentAnalyticsSession();
      trackParentAnalyticsEvent('login_validated');
    }catch(error){
      console.warn(
        "Unable to start NestParent analytics:",
        error
      );
    }

    await loadParentData();

    try{
      await loadAwardsData();
    }catch(error){
      console.error(
        "Unable to preload Parent Awards:",
        error
      );
    }

    try{
      await loadRecentAwardsData();
    }catch(error){
      console.error(
        "Unable to preload recent Parent Awards:",
        error
      );
    }

    try{
      await loadMomentsData();
    }catch(error){
      console.error(
        "Unable to preload Parent Moments:",
        error
      );
    }

    try{
      await loadCelebrationData();
    }catch(error){
      console.error(
        "Unable to preload Parent Celebration:",
        error
      );
    }

    setParentAnalyticsContext();
    applyTimeAtmosphere();
    applyParentGreeting();
    buildCards();
    activateCarousel();
    activateSheet();
    activateNavigation();
    activateArrival();
    activateNestControl();
    activateStageRouter();
    markParentAnalyticsReady();
  }catch(error){
    trackParentAnalyticsEvent('startup_failed',{
      data:{
        message:error instanceof Error?error.message:'Unable to start Parent App.'
      }
    });
    appStarted=false;
    console.error(
      "Unable to start Parent App:",
      error
    );
  }
}

/*   authenticate then start*/
activateParentAuth(startParentApp);
