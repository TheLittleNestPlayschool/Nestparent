import{openNestStage,closeNestStage,isNestStageOpen}from"./parent_carousel.js";
import{isMemoriesStageOpen}from"./parent_memories_stage.js";
import{isMemoryArchiveOpen}from"./parent_memory_archive_stage.js";
import{isAwardsStageOpen}from"./parent_awards_stage.js";
import{isJourneyStageOpen,closeJourneyStage}from"./parent_journey_stage.js";
import{
  isOurNestStageOpen,
  isOurNestDetailStageOpen,
  isPrivacyNoticeStageOpen,
  isLanguageStageOpen,
  closeOurNestStage,
  closeOurNestDetailStage,
  closePrivacyNoticeStage,
  closeLanguageStage
}from"./parent_our_nest_stage.js?v=6";
import{closeMemories,closeEarlierMemories,closeAwards}from"./parent_stage_router.js";
import{isStageMotionLocked}from"./parent_stage_motion.js";

const nestOrb=document.getElementById("nestOrb");

/*   run after current glide*/
function whenStageSettled(callback){
  if(!isStageMotionLocked()){callback();return;}
  window.setTimeout(()=>whenStageSettled(callback),50);
}

/*   open nest*/
function openNest(){
  if(isStageMotionLocked()||isNestStageOpen())return;
  nestOrb?.classList.add("is-open");
  openNestStage();
}

/*   close nest*/
function closeNest(){
  if(isStageMotionLocked()||!isNestStageOpen())return;
  closeNestStage();
  nestOrb?.classList.remove("is-open");
}

/*   return from archive*/
function returnFromArchive(){
  if(isStageMotionLocked()||!isMemoryArchiveOpen())return;
  closeEarlierMemories();
  whenStageSettled(()=>{
    if(isMemoryArchiveOpen()){returnFromArchive();return;}
    if(isMemoriesStageOpen())closeMemories();
  });
}

/*   return from awards*/
function returnFromAwards(){
  if(isStageMotionLocked()||!isAwardsStageOpen())return;
  closeAwards();
  whenStageSettled(()=>{
    if(isAwardsStageOpen())returnFromAwards();
  });
}

/*   handle orb*/
function handleNestOrb(){
  if(isStageMotionLocked())return;
  if(isMemoryArchiveOpen()){returnFromArchive();return;}
  if(isMemoriesStageOpen()){closeMemories();return;}
  if(isAwardsStageOpen()){returnFromAwards();return;}
  if(isPrivacyNoticeStageOpen()){closePrivacyNoticeStage();return;}
  if(isLanguageStageOpen()){closeLanguageStage();return;}
  if(isOurNestDetailStageOpen()){closeOurNestDetailStage();return;}
  if(isOurNestStageOpen()){closeOurNestStage();return;}
  if(isJourneyStageOpen()){closeJourneyStage();return;}
  if(isNestStageOpen()){closeNest();return;}
  openNest();
}

/*   handle main stage return*/
function handleMainStageReturn(){
  if(isStageMotionLocked()||!isNestStageOpen())return;
  if(isPrivacyNoticeStageOpen()){closePrivacyNoticeStage();return;}
  if(isLanguageStageOpen()){closeLanguageStage();return;}
  if(isOurNestDetailStageOpen()){closeOurNestDetailStage();return;}
  if(isOurNestStageOpen()){closeOurNestStage();return;}
  if(isJourneyStageOpen()){closeJourneyStage();return;}
  closeNest();
}

/*   activate nest control*/
export function activateNestControl(){
  if(!nestOrb)return;
  nestOrb.addEventListener("click",handleNestOrb);
  window.addEventListener("parent:return-main-stage",handleMainStageReturn);
}
