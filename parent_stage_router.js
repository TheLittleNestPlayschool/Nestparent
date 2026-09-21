import{
  openMemoriesStage,
  closeMemoriesStage,
  isMemoriesStageOpen
}from"./parent_memories_stage.js";
import{
  openMemoryArchiveStage,
  closeMemoryArchiveStage,
  isMemoryArchiveOpen
}from"./parent_memory_archive_stage.js";
import{
  openAwardsStage,
  closeAwardsStage,
  isAwardsStageOpen
}from"./parent_awards_stage.js";
import{openJourneyStage,isJourneyStageOpen}from"./parent_journey_stage.js";
import{
  openOurNestStage,
  openOurNestDetailStage,
  openPrivacyNoticeStage,
  isOurNestStageOpen
}from"./parent_our_nest_stage.js?v=2";
import{loadAwardsData}from"./parent_awards_data.js";
import{getNestCard}from"./parent_nest_stage.js";

const carousel=document.getElementById("carousel");

/*   open memories*/
function openMemories(){
  if(!carousel||isMemoriesStageOpen())return;
  const nestCard=getNestCard();
  if(!nestCard)return;
  openMemoriesStage({carousel,nestCard});
}

/*   close memories*/
export function closeMemories(){
  if(!carousel||!isMemoriesStageOpen())return;
  closeMemoriesStage({nestCard:getNestCard()});
}

/*   open awards*/
async function openAwards(){
  if(!carousel||isAwardsStageOpen())return;
  const nestCard=getNestCard();
  if(!nestCard)return;
  try{
    await loadAwardsData();
    openAwardsStage({carousel,nestCard});
  }catch(error){
    console.error("Unable to open Awards:",error);
  }
}

/*   close awards*/
export function closeAwards(){
  if(!carousel||!isAwardsStageOpen())return;
  closeAwardsStage();
}

/*   open journey*/
function openJourney(){
  if(!carousel||isJourneyStageOpen())return;
  const nestCard=getNestCard();
  if(!nestCard)return;
  openJourneyStage({carousel,nestCard});
}

/*   open our nest*/
function openOurNest(){
  if(!carousel||isOurNestStageOpen())return;
  const nestCard=getNestCard();
  if(!nestCard)return;
  openOurNestStage({carousel,nestCard});
}

/*   open earlier memories*/
function openEarlierMemories(){
  if(!carousel||!isMemoriesStageOpen()||isMemoryArchiveOpen())return;
  const memoriesCard=carousel.querySelector(".memories-experience");
  if(!memoriesCard)return;
  openMemoryArchiveStage({carousel,memoriesCard});
}

/*   close earlier memories*/
export function closeEarlierMemories(){
  if(!isMemoryArchiveOpen())return;
  const memoriesCard=carousel?.querySelector(".memories-experience");
  closeMemoryArchiveStage({memoriesCard});
}

/*   route nest destination*/
function routeDestination(event){
  const destination=event.detail?.destination;
  if(!destination)return;
  if(destination==="memories"){openMemories();return;}
  if(destination==="awards"){openAwards();return;}
  if(destination==="journey"){openJourney();return;}
  if(destination==="our-nest"){openOurNest();}
}

/*   route our nest option*/
function routeOurNestOption(event){
  const option=event.detail?.option;
  if(!option||!isOurNestStageOpen())return;
  openOurNestDetailStage(option);
}

/*   route account action*/
function routeAccountAction(event){
  const action=event.detail?.action;
  if(action==="privacy-notice"){
    openPrivacyNoticeStage();
  }
}

/*   route memory chapter*/
function routeMemoryChapter(event){
  const chapter=event.detail?.chapter;
  if(!chapter)return;
  if(chapter==="earlier"){openEarlierMemories();return;}
  /* Today, This Week and August will be connected to their memory collections next. */
}

/*   route special collection*/
function routeMemoryCollection(event){
  const collection=event.detail?.collection;
  if(!collection)return;
  /* Recognition Days and Birthdays will be connected next. */
  console.log("Memory collection:",collection);
}

/*   activate stage router*/
export function activateStageRouter(){
  window.addEventListener("parent:nest-destination",routeDestination);
  window.addEventListener("parent:our-nest-option",routeOurNestOption);
  window.addEventListener("parent:account-action",routeAccountAction);
  window.addEventListener("parent:memory-chapter",routeMemoryChapter);
  window.addEventListener("parent:memory-collection",routeMemoryCollection);
}
