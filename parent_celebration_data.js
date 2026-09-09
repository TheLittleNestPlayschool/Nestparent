import{
  getStudentMedia,
  getSignedThumbnails
}from"./parent_data.js";

const XANO_BASE_URL="https://x8ki-letl-twmt.n7.xano.io/api:ro6SX8PH";
let celebrationData=null;

function text(value){return typeof value==="string"?value.trim():"";}
function timestamp(value){let time=Number(value)||0;if(time&&time<1000000000000){time*=1000;}return time;}
function positiveId(value){const id=Number(value);return Number.isFinite(id)&&id>0?id:0;}
function keyPart(value){return text(value).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");}

/*   load celebration data*/
export async function loadCelebrationData(){
  const authToken=localStorage.getItem("authToken");
  const response=await fetch(`${XANO_BASE_URL}/pa_get_celebrations`,{
    method:"GET",
    headers:{Authorization:`Bearer ${authToken}`}
  });
  const data=await response.json();
  if(!response.ok){throw new Error(data.message||"Unable to load Celebration.");}
  celebrationData=data;
  return data;
}

/*   get celebration data*/
export function getCelebrationData(){
  return celebrationData;
}

/*   get fallback photo*/
function getLatestPhoto(){
  const media=getStudentMedia()||[];
  const thumbnails=getSignedThumbnails()||[];
  return media
    .map((item,index)=>({item,photo:thumbnails[index]||""}))
    .filter(entry=>entry.photo&&!entry.item?.is_deleted)
    .sort((a,b)=>timestamp(b.item?.created_at)-timestamp(a.item?.created_at))[0]?.photo||"";
}

/*   get media url*/
function getMediaUrl(item){
  return[
    item?.signed_thumbnail_url,
    item?.signed_thumbnail,
    item?.thumbnail_url,
    item?.signed_url,
    item?.media_url
  ].map(text).find(value=>/^https?:\/\//i.test(value))||"";
}

/*   get celebration id*/
function getCelebrationId(celebration){
  const media=Array.isArray(celebration?.media)?celebration.media:[];
  const candidates=[
    celebration?.id,
    celebration?.celebration_id,
    celebrationData?.celebration_id,
    ...media.map(item=>item?.celebration_id)
  ];
  return candidates.map(positiveId).find(Boolean)||0;
}

/*   get celebration key*/
function getCelebrationKey(celebration){
  const date=text(celebration?.date)||"undated";
  const name=keyPart(celebration?.name||celebration?.type||"celebration")||"celebration";
  return`${date}:${name}`;
}

/*   prepare celebration media*/
function getCelebrationMedia(celebration,identity){
  const media=Array.isArray(celebration?.media)?celebration.media:[];
  return media.map(item=>({
    id:positiveId(item?.id),
    celebration_id:identity.id||positiveId(item?.celebration_id),
    celebration_key:identity.key,
    celebration_name:identity.name,
    celebration_date:identity.date,
    celebration_type:identity.type,
    media_collection_type_id:positiveId(item?.media_collection_type_id),
    kind:text(item?.media_kind)||"media",
    url:getMediaUrl(item),
    thumbnail_filename:text(item?.thumbnail_filename),
    original_filename:text(item?.original_filename),
    created_at:Number(item?.created_at)||0
  }));
}

/*   get celebration experience*/
export function getCelebrationExperience(){
  const celebration=celebrationData?.celebration;
  if(!celebration||!text(celebration?.name)){return null;}

  const title=text(celebration?.name)||"A Special Day to Celebrate";
  const identity={
    id:getCelebrationId(celebration),
    key:getCelebrationKey(celebration),
    name:title,
    date:text(celebration?.date),
    type:text(celebration?.type)
  };
  const media=getCelebrationMedia(celebration,identity);
  const parentTitle=text(celebration?.parent_title);
  const copy=text(celebration?.parent_message)||"A special Little Nest memory worth celebrating together.";
  const hero=media.find(item=>item.url)?.url||getLatestPhoto();

  return{
    type:"celebration",
    experience_type_code:"celebration",
    title,
    label:"Celebration",
    copy,
    photo:hero,
    celebration_id:identity.id,
    celebration_key:identity.key,
    celebration_name:identity.name,
    celebration_date:identity.date,
    celebration_type:identity.type,
    celebration_parent_title:parentTitle,
    celebration_media:media,
    celebration_media_count:media.length,
    categories:[],
    deeper:"",
    learning:[]
  };
}
