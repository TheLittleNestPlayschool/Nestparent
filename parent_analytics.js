import{
  getParentData,
  getStudentMedia,
  getStudentMediaCollections,
  getCurrentSessionDetails
}from"./parent_data.js";
import{getParentExperiences}from"./parent_experience_feed.js";

/*   analytics configuration*/
const USAGE_URL='https://x8ki-letl-twmt.n7.xano.io/api:ro6SX8PH/np_usage_session';
const APP_VERSION='1.0.0';
const DB_NAME='nestparent_usage';
const DB_VERSION=1;
const STORE_NAME='sessions';
const SCHEMA_VERSION=3;
const IDLE_TIMEOUT_MS=60000;
const PERSIST_DELAY_MS=250;
const IDENTITY_SELECTOR='[data-memory-media-id],[data-media-id],[data-selected-media-ids],[data-memory-archive],[data-memory-collection],[data-memory-chapter],[data-award-category],[data-category-id],[data-award-badge],[data-student-badge-id],[data-celebration-id],[data-celebration-key],[data-celebration-name],[data-celebration-date],[data-celebration-type],[data-celebration-media-id],[data-media-collection-type-id]';

let currentSession=null;
let activeStartedAt=null;
let isIdle=false;
let windowFocused=document.hasFocus();
let idleTimer=null;
let persistTimer=null;
let listenersBound=false;
let sessionFinalized=false;
let dbPromise=null;
let viewObserver=null;
let viewCheckScheduled=false;
let currentViewKey=null;
let currentViewContext=null;
let currentViewStartedAt=null;
let currentViewActiveStartedAt=null;
let currentViewActiveDurationMs=0;
const scrollMilestones=new Map();

/*   public analytics api*/
export async function startParentAnalyticsSession(){
  if(currentSession){return currentSession;}
  const now=Date.now();
  currentSession={
    session_uuid:createSessionUuid(),
    schema_version:SCHEMA_VERSION,
    started_at:now,
    ended_at:null,
    last_event_at:now,
    total_duration_ms:0,
    active_duration_ms:0,
    event_count:0,
    end_reason:null,
    is_complete:false,
    app_version:APP_VERSION,
    device_type:getDeviceType(),
    platform:getPlatform(),
    browser:getBrowser(),
    screen_width:window.screen?.width||0,
    screen_height:window.screen?.height||0,
    viewport_width:window.innerWidth||0,
    viewport_height:window.innerHeight||0,
    language:navigator.language||'',
    timezone:getTimezone(),
    online_at_start:navigator.onLine,
    session_context:{},
    events:[]
  };
  sessionFinalized=false;
  isIdle=false;
  windowFocused=document.hasFocus();
  bindAnalyticsListeners();
  bindViewObserver();
  if(canCountActiveTime()){startActivePeriod(now);}
  resetIdleTimer();
  addEvent('app_started');
  await persistCurrentSession();
  void retryPendingSessions(currentSession.session_uuid);
  return currentSession;
}

export function setParentAnalyticsContext(extra={}){
  if(!currentSession||sessionFinalized){return;}
  let experiences=[];
  try{experiences=getParentExperiences()||[];}catch{experiences=[];}
  const parentData=getParentData()||{};
  const session=getCurrentSessionDetails()||{};
  const media=getStudentMedia()||[];
  const collections=getStudentMediaCollections()||[];
  const context=cleanObject({
    current_session_id:toPositiveNumber(session?.id),
    experience_count:experiences.length,
    available_experience_types:experiences.map(item=>item?.experience_type_code).filter(Boolean),
    media_count:media.length,
    media_collection_count:collections.length,
    has_moment:experiences.some(item=>item?.experience_type_code==='moments'&&toPositiveNumber(item?.moment_id)),
    has_award:experiences.some(item=>item?.experience_type_code==='award'),
    has_celebration:experiences.some(item=>item?.experience_type_code==='celebration'),
    signed_thumbnail_count:Array.isArray(parentData?.signed_thumbnails)?parentData.signed_thumbnails.length:0,
    ...extra
  });
  currentSession.session_context={...currentSession.session_context,...context};
  schedulePersist();
}

export function trackParentAnalyticsEvent(type,details={}){
  if(!currentSession||sessionFinalized){return;}
  addEvent(type,details);
}

export function markParentAnalyticsReady(){
  if(!currentSession||sessionFinalized){return;}
  addEvent('app_ready');
  scheduleActiveViewCheck();
}

export async function finishParentAnalyticsSession(reason='manual'){
  const payload=finalizeSession(reason,true);
  if(!payload){return false;}
  try{
    await uploadPayload(payload);
    await deleteSession(payload.session_uuid);
    return true;
  }catch(error){
    console.warn('NestParent analytics upload failed. Session kept locally.',error);
    return false;
  }
}

/*   event capture*/
function bindAnalyticsListeners(){
  if(listenersBound){return;}
  listenersBound=true;
  document.addEventListener('click',handleClick,true);
  document.addEventListener('change',handleChange,true);
  document.addEventListener('pointerdown',markUserActivity,{capture:true,passive:true});
  document.addEventListener('keydown',markUserActivity,true);
  document.addEventListener('touchstart',markUserActivity,{capture:true,passive:true});
  document.addEventListener('scroll',handleScroll,{capture:true,passive:true});
  document.addEventListener('visibilitychange',handleVisibilityChange);
  window.addEventListener('focus',handleWindowFocus);
  window.addEventListener('blur',handleWindowBlur);
  window.addEventListener('online',handleOnline);
  window.addEventListener('offline',handleOffline);
  window.addEventListener('error',handleJavascriptError);
  window.addEventListener('unhandledrejection',handleUnhandledRejection);
  window.addEventListener('pagehide',handlePageHide);
  window.addEventListener('pageshow',handlePageShow);
  window.addEventListener('parent:nest-destination',handleNestDestination);
  window.addEventListener('parent:memory-chapter',handleMemoryChapter);
  window.addEventListener('parent:memory-collection',handleMemoryCollection);
}

function handleClick(event){
  markUserActivity();
  const target=getMeaningfulTarget(event.target);
  if(!target){return;}
  addEvent('click',getTargetInfo(target));
}

function handleChange(event){
  markUserActivity();
  const target=event.target instanceof Element?event.target:null;
  if(!target){return;}
  const targetInfo=getTargetInfo(target);
  const data={...(targetInfo.data||{}),field_name:getControlName(target)};
  if(target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement){
    data.input_type=target instanceof HTMLInputElement?target.type:'textarea';
    if(target instanceof HTMLInputElement&&(target.type==='checkbox'||target.type==='radio')){
      data.checked=target.checked;
    }else{
      data.character_count=String(target.value||'').length;
    }
  }
  if(target instanceof HTMLSelectElement){data.selected_index=target.selectedIndex;}
  addEvent('input_change',{...targetInfo,data});
}

function handleScroll(event){
  markUserActivity();
  if(!currentViewKey||!(event.target instanceof Element)){return;}
  const target=event.target;
  const maxScroll=target.scrollHeight-target.clientHeight;
  if(maxScroll<=8){return;}
  const percent=Math.max(0,Math.min(100,Math.round((target.scrollTop/maxScroll)*100)));
  const seen=scrollMilestones.get(currentViewKey)||new Set();
  [25,50,75,100].forEach(milestone=>{
    if(percent<milestone||seen.has(milestone)){return;}
    seen.add(milestone);
    addEvent('scroll_depth',{
      ...currentViewContext,
      control:getControlName(target),
      data:{milestone,scroll_percent:percent}
    });
  });
  scrollMilestones.set(currentViewKey,seen);
}

function handleNestDestination(event){
  const destination=event?.detail?.destination;
  if(!destination){return;}
  addEvent('nest_destination',{destination,action:'open_destination'});
}

function handleMemoryChapter(event){
  const chapter=event?.detail?.chapter;
  if(!chapter){return;}
  addEvent('memory_chapter',{chapter,action:'open_memory_chapter'});
}

function handleMemoryCollection(event){
  const collection=event?.detail?.collection;
  if(!collection){return;}
  addEvent('memory_collection',{collection,action:'open_memory_collection'});
}

function getMeaningfulTarget(rawTarget){
  if(!(rawTarget instanceof Element)){return null;}
  return rawTarget.closest('button,a,input,select,textarea,label,[role="button"],[data-action],.celebration-media-item,.story-detail-photo,.experience')||rawTarget;
}

function getTargetInfo(target){
  const card=target.closest?.('.experience')||null;
  const context=getExperienceContext(card);
  const identity=getElementIdentity(target,card);
  const navItem=target.closest?.('.nav-item')||null;
  const navText=navItem?.querySelector?.('.nav-text')?.textContent?.trim()||'';
  const position=card?.dataset?.pos;
  let action=target.dataset?.action||target.getAttribute?.('name')||null;
  let control=getControlName(target);
  if(target.id==='nestOrb'){action='open_nest';control='nest_orb';}
  else if(navItem){action='navigate';control=`nav_${slug(navText||'item')}`;}
  else if(target.id==='sheetClose'){action='close_sheet';control='close_sheet';}
  else if(card?.classList.contains('is-stage-back')){action='back';control='back_card';}
  else if(target.classList?.contains('celebration-media-item')){action='open_media';control='celebration_media';}
  else if(card?.dataset?.index!==undefined){
    action=String(position)==='0'?'open_experience':'move_to_experience';
    control='experience_card';
  }
  return cleanObject({
    ...context,
    ...identity,
    action,
    target:target.tagName?target.tagName.toLowerCase():null,
    target_id:target.id||null,
    control,
    data:{
      class_name:target.classList?Array.from(target.classList).slice(0,8).join(' '):null,
      role:target.getAttribute?.('role')||null,
      aria_label:target.getAttribute?.('aria-label')||null,
      card_position:position,
      navigation_destination:navText?slug(navText):null
    }
  });
}

function getElementIdentity(target,card=null){
  if(!(target instanceof Element)){return{};}
  const source=target.matches?.(IDENTITY_SELECTOR)?target:target.closest?.(IDENTITY_SELECTOR);
  const dataset={...(card?.dataset||{}),...(source?.dataset||{})};
  const celebrationMediaId=toPositiveNumber(dataset.celebrationMediaId);
  return cleanObject({
    media_id:toPositiveNumber(dataset.memoryMediaId||dataset.mediaId||dataset.celebrationMediaId),
    media_ids:parseNumberList(dataset.selectedMediaIds||dataset.mediaIds),
    media_index:toInteger(dataset.memoryMediaIndex),
    memory_chapter:dataset.memoryChapter||null,
    memory_collection:dataset.memoryCollection||null,
    memory_collection_type_id:toPositiveNumber(dataset.memoryCollectionTypeId||dataset.mediaCollectionTypeId),
    memory_archive:dataset.memoryArchive||null,
    memory_year:toInteger(dataset.memoryYear),
    memory_month:toInteger(dataset.memoryMonth),
    development_category_id:toPositiveNumber(dataset.awardCategory||dataset.categoryId||dataset.developmentCategoryId),
    badge_id:toPositiveNumber(dataset.awardBadge||dataset.badgeId),
    student_badge_id:toPositiveNumber(dataset.studentBadgeId),
    celebration_id:toPositiveNumber(dataset.celebrationId),
    celebration_key:dataset.celebrationKey||null,
    celebration_name:dataset.celebrationName||null,
    celebration_date:dataset.celebrationDate||null,
    celebration_type:dataset.celebrationType||null,
    celebration_media_id:celebrationMediaId
  });
}

function getControlName(target){
  if(!(target instanceof Element)){return null;}
  if(target.dataset?.action){return slug(target.dataset.action);}
  if(target.getAttribute('name')){return slug(target.getAttribute('name'));}
  if(target.id){return slug(target.id);}
  const usefulClass=Array.from(target.classList||[]).find(name=>!['card','experience','active','is-visible'].includes(name));
  return usefulClass?slug(usefulClass):target.tagName?.toLowerCase()||null;
}

/*   active view tracking*/
function bindViewObserver(){
  if(viewObserver){return;}
  const carousel=document.getElementById('carousel');
  if(!carousel){return;}
  viewObserver=new MutationObserver(scheduleActiveViewCheck);
  viewObserver.observe(carousel,{
    childList:true,
    subtree:true,
    attributes:true,
    attributeFilter:['data-pos','class','data-memory-media-id','data-category-id','data-award-badge','data-student-badge-id','data-celebration-id','data-celebration-key']
  });
  scheduleActiveViewCheck();
}

function scheduleActiveViewCheck(){
  if(viewCheckScheduled||!currentSession||sessionFinalized){return;}
  viewCheckScheduled=true;
  requestAnimationFrame(()=>{
    viewCheckScheduled=false;
    updateActiveView();
  });
}

function updateActiveView(){
  if(!currentSession||sessionFinalized){return;}
  const carousel=document.getElementById('carousel');
  const activeCards=carousel?[...carousel.querySelectorAll('.experience[data-pos="0"]')]:[];
  const card=activeCards[activeCards.length-1]||null;
  if(!card){return;}
  const context=getExperienceContext(card);
  const key=getViewKey(card,context);
  if(key===currentViewKey){return;}
  const now=Date.now();
  finishCurrentView(now,'view_changed');
  currentViewKey=key;
  currentViewContext=context;
  currentViewStartedAt=now;
  currentViewActiveDurationMs=0;
  currentViewActiveStartedAt=canCountActiveTime()?now:null;
  addEvent('view_started',context);
}

function finishCurrentView(now=Date.now(),reason='view_changed'){
  if(!currentViewKey||!currentViewContext||currentViewStartedAt===null){return;}
  if(currentViewActiveStartedAt!==null){
    currentViewActiveDurationMs+=Math.max(0,now-currentViewActiveStartedAt);
    currentViewActiveStartedAt=null;
  }
  addEvent('view_ended',{
    ...currentViewContext,
    duration_ms:currentViewActiveDurationMs,
    data:{elapsed_ms:Math.max(0,now-currentViewStartedAt),reason}
  });
  currentViewKey=null;
  currentViewContext=null;
  currentViewStartedAt=null;
  currentViewActiveDurationMs=0;
}

function getViewKey(card,context){
  const identity=[
    context.media_id,
    context.development_category_id,
    context.badge_id,
    context.student_badge_id,
    context.celebration_key,
    context.celebration_id,
    context.memory_collection,
    context.memory_archive
  ].filter(value=>value!==null&&value!==undefined&&value!=='').join(':');
  if(card?.dataset?.index!==undefined){return`main:${card.dataset.index}:${context.experience_type_code||''}:${identity}`;}
  return`stage:${context.view||'unknown'}:${context.experience_type_code||''}:${identity}`;
}

function getExperienceContext(card){
  if(!card){return{};}
  const index=card.dataset?.index!==undefined?Number(card.dataset.index):null;
  let item=null;
  if(Number.isInteger(index)){
    try{item=getParentExperiences()?.[index]||null;}catch{item=null;}
  }
  const sessionId=toPositiveNumber(getCurrentSessionDetails()?.id);
  const experienceCode=item?.experience_type_code||getStageExperienceCode(card);
  const sessionBound=new Set(['today_story','learning_discovery','activity','growth','together']);
  return cleanObject({
    view:getViewName(card,item),
    experience_index:Number.isInteger(index)?index:null,
    experience_type:item?.type||null,
    experience_type_code:experienceCode,
    session_id:sessionBound.has(experienceCode)?sessionId:null,
    moment_id:toPositiveNumber(item?.moment_id),
    celebration_id:toPositiveNumber(item?.celebration_id),
    celebration_key:item?.celebration_key||null,
    celebration_name:item?.celebration_name||null,
    celebration_date:item?.celebration_date||null,
    celebration_type:item?.celebration_type||null,
    ...getElementIdentity(card,card)
  });
}

function getViewName(card,item){
  if(card?.dataset?.experienceType){return slug(card.dataset.experienceType);}
  if(item?.experience_type_code){return slug(item.experience_type_code);}
  const className=Array.from(card?.classList||[]).find(name=>name.endsWith('-experience')&&name!=='experience');
  return className?slug(className.replace(/-experience$/,'')):'experience';
}

function getStageExperienceCode(card){
  const view=getViewName(card,null);
  if(view.includes('story')){return'today_story';}
  if(view.includes('learning')){return'learning_discovery';}
  if(view.includes('activity')){return'activity';}
  if(view.includes('growth')){return'growth';}
  if(view.includes('memories')||view.includes('memory')){return'memories';}
  if(view.includes('award')){return'award';}
  if(view.includes('nest')){return'nest';}
  if(view.includes('celebration')){return'celebration';}
  return null;
}

/*   activity timing*/
function markUserActivity(){
  if(!currentSession||sessionFinalized){return;}
  const now=Date.now();
  if(isIdle){
    isIdle=false;
    if(canCountActiveTime()){startActivePeriod(now);}
    addEvent('idle_ended');
  }
  resetIdleTimer();
}

function resetIdleTimer(){
  clearIdleTimer();
  if(!currentSession||sessionFinalized||document.visibilityState!=='visible'||!windowFocused){return;}
  idleTimer=window.setTimeout(()=>{
    if(!currentSession||sessionFinalized||isIdle||!canCountActiveTime()){return;}
    const now=Date.now();
    stopActivePeriod(now);
    isIdle=true;
    addEvent('idle_started');
    void persistCurrentSession();
  },IDLE_TIMEOUT_MS);
}

function clearIdleTimer(){
  if(idleTimer===null){return;}
  window.clearTimeout(idleTimer);
  idleTimer=null;
}

function canCountActiveTime(){return document.visibilityState==='visible'&&windowFocused&&!isIdle;}
function startActivePeriod(now=Date.now()){
  if(activeStartedAt===null){activeStartedAt=now;}
  if(currentViewKey&&currentViewActiveStartedAt===null){currentViewActiveStartedAt=now;}
}
function stopActivePeriod(now=Date.now()){
  if(currentSession&&activeStartedAt!==null){
    currentSession.active_duration_ms+=Math.max(0,now-activeStartedAt);
    activeStartedAt=null;
  }
  if(currentViewKey&&currentViewActiveStartedAt!==null){
    currentViewActiveDurationMs+=Math.max(0,now-currentViewActiveStartedAt);
    currentViewActiveStartedAt=null;
  }
}

/*   lifecycle*/
function handleVisibilityChange(){
  if(!currentSession||sessionFinalized){return;}
  const now=Date.now();
  if(document.visibilityState==='hidden'){
    stopActivePeriod(now);
    clearIdleTimer();
    addEvent('app_hidden');
    void persistCurrentSession();
    return;
  }
  isIdle=false;
  if(canCountActiveTime()){startActivePeriod(now);}
  resetIdleTimer();
  addEvent('app_visible');
}

function handleWindowFocus(){
  if(!currentSession||sessionFinalized){return;}
  windowFocused=true;
  isIdle=false;
  const now=Date.now();
  if(canCountActiveTime()){startActivePeriod(now);}
  resetIdleTimer();
  addEvent('window_focus');
}

function handleWindowBlur(){
  if(!currentSession||sessionFinalized){return;}
  windowFocused=false;
  stopActivePeriod(Date.now());
  clearIdleTimer();
  addEvent('window_blur');
  void persistCurrentSession();
}

function handleOnline(){addEvent('online');}
function handleOffline(){addEvent('offline');void persistCurrentSession();}
function handleJavascriptError(event){
  addEvent('javascript_error',{data:{message:event.message||'Unknown JavaScript error',source:event.filename||null,line:event.lineno||null,column:event.colno||null}});
  void persistCurrentSession();
}
function handleUnhandledRejection(event){
  const reason=event.reason instanceof Error?event.reason.message:String(event.reason||'Unhandled promise rejection');
  addEvent('unhandled_rejection',{data:{message:reason}});
  void persistCurrentSession();
}
function handlePageHide(event){
  if(!currentSession||sessionFinalized){return;}
  if(event.persisted){
    stopActivePeriod(Date.now());
    addEvent('app_bfcache_hidden');
    void persistCurrentSession();
    return;
  }
  const payload=finalizeSession('pagehide',true);
  if(payload){void uploadPayloadKeepalive(payload);}
}
function handlePageShow(event){
  if(!event.persisted||!currentSession||sessionFinalized){return;}
  windowFocused=document.hasFocus();
  isIdle=false;
  if(canCountActiveTime()){startActivePeriod(Date.now());}
  resetIdleTimer();
  addEvent('app_bfcache_restored');
  scheduleActiveViewCheck();
}

/*   session events*/
function addEvent(type,details={}){
  if(!currentSession||sessionFinalized){return;}
  const now=Date.now();
  const event={seq:currentSession.events.length+1,type,at_ms:Math.max(0,now-currentSession.started_at),occurred_at:now};
  const cleaned=cleanObject(details);
  Object.assign(event,cleaned);
  currentSession.events.push(event);
  currentSession.last_event_at=now;
  currentSession.event_count=currentSession.events.length;
  schedulePersist();
}

function finalizeSession(reason,isComplete){
  if(!currentSession||sessionFinalized){return null;}
  const now=Date.now();
  stopActivePeriod(now);
  clearIdleTimer();
  finishCurrentView(now,'session_end');
  addEvent('session_ended',{data:{reason}});
  currentSession.ended_at=now;
  currentSession.total_duration_ms=Math.max(0,now-currentSession.started_at);
  currentSession.end_reason=reason;
  currentSession.is_complete=isComplete;
  currentSession.event_count=currentSession.events.length;
  sessionFinalized=true;
  if(persistTimer!==null){window.clearTimeout(persistTimer);persistTimer=null;}
  const snapshot=buildStoredSnapshot();
  void putSession(snapshot);
  return buildUploadPayload(snapshot);
}

/*   local persistence*/
function schedulePersist(){
  if(!currentSession||sessionFinalized){return;}
  if(persistTimer!==null){window.clearTimeout(persistTimer);}
  persistTimer=window.setTimeout(()=>{persistTimer=null;void persistCurrentSession();},PERSIST_DELAY_MS);
}
async function persistCurrentSession(){
  if(!currentSession){return;}
  try{await putSession(buildStoredSnapshot());}
  catch(error){console.warn('NestParent analytics local save failed:',error);}
}
function buildStoredSnapshot(){
  if(!currentSession){return null;}
  const now=Date.now();
  const activeDuration=currentSession.active_duration_ms+(activeStartedAt!==null?Math.max(0,now-activeStartedAt):0);
  return{
    ...currentSession,
    total_duration_ms:currentSession.ended_at?currentSession.total_duration_ms:Math.max(0,now-currentSession.started_at),
    active_duration_ms:activeDuration,
    event_count:currentSession.events.length,
    events:currentSession.events.map(event=>structuredCloneSafe(event)),
    session_context:structuredCloneSafe(currentSession.session_context)
  };
}
function openDatabase(){
  if(dbPromise){return dbPromise;}
  dbPromise=new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB_NAME,DB_VERSION);
    request.onupgradeneeded=()=>{
      const db=request.result;
      if(!db.objectStoreNames.contains(STORE_NAME)){db.createObjectStore(STORE_NAME,{keyPath:'session_uuid'});}
    };
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
  return dbPromise;
}
async function putSession(session){
  if(!session){return;}
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction(STORE_NAME,'readwrite');
    transaction.objectStore(STORE_NAME).put(session);
    transaction.oncomplete=resolve;
    transaction.onerror=()=>reject(transaction.error);
  });
}
async function getAllSessions(){
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{
    const request=db.transaction(STORE_NAME,'readonly').objectStore(STORE_NAME).getAll();
    request.onsuccess=()=>resolve(Array.isArray(request.result)?request.result:[]);
    request.onerror=()=>reject(request.error);
  });
}
async function deleteSession(sessionUuid){
  const db=await openDatabase();
  return new Promise((resolve,reject)=>{
    const transaction=db.transaction(STORE_NAME,'readwrite');
    transaction.objectStore(STORE_NAME).delete(sessionUuid);
    transaction.oncomplete=resolve;
    transaction.onerror=()=>reject(transaction.error);
  });
}

/*   upload and retry*/
async function retryPendingSessions(currentUuid){
  let sessions=[];
  try{sessions=await getAllSessions();}
  catch(error){console.warn('Unable to read pending NestParent analytics sessions:',error);return;}
  for(const storedSession of sessions){
    if(storedSession.session_uuid===currentUuid){continue;}
    const session=recoverIncompleteSession(storedSession);
    try{
      await uploadPayload(buildUploadPayload(session));
      await deleteSession(session.session_uuid);
    }catch(error){console.warn('Pending NestParent analytics upload failed:',error);}
  }
}
function recoverIncompleteSession(session){
  if(session.ended_at){return session;}
  const recoveredEnd=session.last_event_at||session.started_at;
  return{
    ...session,
    ended_at:recoveredEnd,
    total_duration_ms:Math.max(0,recoveredEnd-session.started_at),
    end_reason:'recovered_unclean_exit',
    is_complete:false
  };
}
function buildUploadPayload(session){
  return{
    session_uuid:session.session_uuid,
    schema_version:session.schema_version,
    started_at_:session.started_at,
    ended_at__:session.ended_at,
    last_event_at:session.last_event_at,
    total_duration_ms:session.total_duration_ms,
    active_duration_ms:session.active_duration_ms,
    event_count:session.event_count,
    end_reason:session.end_reason,
    is_complete:session.is_complete,
    app_version:session.app_version,
    device_type:session.device_type,
    platform:session.platform,
    browser:session.browser,
    screen_width:session.screen_width,
    screen_height:session.screen_height,
    viewport_width:session.viewport_width,
    viewport_height:session.viewport_height,
    language:session.language,
    timezone:session.timezone,
    online_at_start:session.online_at_start,
    session_context:session.session_context,
    events:session.events
  };
}
async function uploadPayload(payload){
  const authToken=localStorage.getItem('authToken');
  if(!authToken){throw new Error('No NestParent auth token available.');}
  const response=await fetch(USAGE_URL,{
    method:'POST',
    headers:{'Accept':'application/json','Content-Type':'application/json','Authorization':`Bearer ${authToken}`},
    body:JSON.stringify(payload)
  });
  let data=null;
  try{data=await response.json();}catch{data=null;}
  if(!response.ok||data?.success!==true){
    throw new Error(data?.message||data?.error||`NestParent usage upload failed with status ${response.status}.`);
  }
  return data;
}
async function uploadPayloadKeepalive(payload){
  const authToken=localStorage.getItem('authToken');
  if(!authToken){return;}
  try{
    const response=await fetch(USAGE_URL,{
      method:'POST',
      keepalive:true,
      headers:{'Accept':'application/json','Content-Type':'application/json','Authorization':`Bearer ${authToken}`},
      body:JSON.stringify(payload)
    });
    if(!response.ok){return;}
    let data=null;
    try{data=await response.json();}catch{data=null;}
    if(data?.success===true){await deleteSession(payload.session_uuid);}
  }catch{/*   local copy remains for retry*/}
}

/*   helpers*/
function cleanObject(value){
  const cleaned=cleanValue(value);
  return cleaned&&typeof cleaned==='object'&&!Array.isArray(cleaned)?cleaned:{};
}
function cleanValue(value){
  if(value===null||value===undefined||value===''){return undefined;}
  if(Array.isArray(value)){
    const result=value.map(cleanValue).filter(item=>item!==undefined);
    return result.length?result:undefined;
  }
  if(typeof value==='object'){
    const result={};
    Object.entries(value).forEach(([key,item])=>{
      const cleaned=cleanValue(item);
      if(cleaned!==undefined){result[key]=cleaned;}
    });
    return Object.keys(result).length?result:undefined;
  }
  return value;
}
function structuredCloneSafe(value){
  try{return structuredClone(value);}catch{return JSON.parse(JSON.stringify(value));}
}
function toPositiveNumber(value){
  const number=Number(value);
  return Number.isFinite(number)&&number>0?number:null;
}
function toInteger(value){
  if(value===null||value===undefined||value===''){return null;}
  const number=Number(value);
  return Number.isFinite(number)?Math.trunc(number):null;
}
function parseNumberList(value){
  if(Array.isArray(value)){
    const numbers=value.map(toPositiveNumber).filter(Boolean);
    return numbers.length?numbers:null;
  }
  if(typeof value!=='string'||!value.trim()){return null;}
  const numbers=value.split(',').map(item=>toPositiveNumber(item.trim())).filter(Boolean);
  return numbers.length?numbers:null;
}
function slug(value){
  return String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
}
function createSessionUuid(){
  if(globalThis.crypto&&typeof globalThis.crypto.randomUUID==='function'){return globalThis.crypto.randomUUID();}
  return[Date.now().toString(36),Math.random().toString(36).slice(2),Math.random().toString(36).slice(2)].join('-');
}
function getDeviceType(){
  const userAgent=navigator.userAgent||'';
  if(/iPad|Tablet/i.test(userAgent)){return'tablet';}
  if(/Mobi|Android|iPhone/i.test(userAgent)){return'mobile';}
  return'desktop';
}
function getPlatform(){return navigator.userAgentData?.platform||navigator.platform||'';}
function getBrowser(){
  const userAgent=navigator.userAgent||'';
  if(/Edg\//.test(userAgent)){return'Edge';}
  if(/OPR\//.test(userAgent)){return'Opera';}
  if(/Chrome\//.test(userAgent)&&!/Edg\//.test(userAgent)){return'Chrome';}
  if(/Firefox\//.test(userAgent)){return'Firefox';}
  if(/Safari\//.test(userAgent)&&!/Chrome\//.test(userAgent)){return'Safari';}
  return'Unknown';
}
function getTimezone(){
  try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'Asia/Manila';}
  catch{return'Asia/Manila';}
}
