import{
  openNestStage,
  closeNestStage,
  isNestStageOpen
}from"./parent_carousel.js";
import{
  isMemoriesStageOpen
}from"./parent_memories_stage.js";
import{
  isMemoryArchiveOpen
}from"./parent_memory_archive_stage.js";
import{
  closeMemories,
  closeEarlierMemories
}from"./parent_stage_router.js";
import{
  isStageMotionLocked
}from"./parent_stage_motion.js";

const nestOrb=document.getElementById("nestOrb");

/*   run after current glide*/
function whenStageSettled(callback){
  if(!isStageMotionLocked()){
    callback();
    return;
  }

  window.setTimeout(
    ()=>whenStageSettled(callback),
    50
  );
}

/*   open nest*/
function openNest(){
  if(isStageMotionLocked()||isNestStageOpen())return;

  if(nestOrb){
    nestOrb.classList.add("is-open");
  }

  openNestStage();
}

/*   close nest*/
function closeNest(){
  if(isStageMotionLocked()||!isNestStageOpen())return;

  closeNestStage();

  if(nestOrb){
    nestOrb.classList.remove("is-open");
  }
}

/*   return from memories*/
function returnFromMemories(){
  if(isStageMotionLocked()||!isMemoriesStageOpen())return;
  closeMemories();
}

/*   return from archive*/
function returnFromArchive(){
  if(isStageMotionLocked()||!isMemoryArchiveOpen())return;

  closeEarlierMemories();

  whenStageSettled(()=>{
    if(isMemoryArchiveOpen()){
      returnFromArchive();
      return;
    }

    if(isMemoriesStageOpen()){
      closeMemories();
    }
  });
}

/*   handle orb*/
function handleNestOrb(){
  if(isStageMotionLocked())return;

  if(isMemoryArchiveOpen()){
    returnFromArchive();
    return;
  }

  if(isMemoriesStageOpen()){
    returnFromMemories();
    return;
  }

  if(isNestStageOpen()){
    closeNest();
    return;
  }

  openNest();
}

/*   handle main stage return*/
function handleMainStageReturn(){
  if(isStageMotionLocked()||!isNestStageOpen())return;
  closeNest();
}

/*   activate nest control*/
export function activateNestControl(){
  if(!nestOrb)return;

  nestOrb.addEventListener("click",handleNestOrb);
  window.addEventListener("parent:return-main-stage",handleMainStageReturn);
}
