import{
  getStudentMedia,
  getSignedThumbnails
}from"./parent_data.js";

const XANO_BASE_URL="https://x8ki-letl-twmt.n7.xano.io/api:ro6SX8PH";
let celebrationData=null;

function text(value){return typeof value==="string"?value.trim():"";}
function timestamp(value){let time=Number(value)||0;if(time&&time<1000000000000){time*=1000;}return time;}

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

/*   prepare celebration media*/
function getCelebrationMedia(celebration){
  const media=Array.isArray(celebration?.media)?celebration.media:[];
  return media.map(item=>({
    id:Number(item?.id)||0,
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

  const media=getCelebrationMedia(celebration);
  const title=text(celebration?.name)||"A Special Day to Celebrate";
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
    celebration_name:title,
    celebration_date:text(celebration?.date),
    celebration_type:text(celebration?.type),
    celebration_parent_title:parentTitle,
    celebration_media:media,
    celebration_media_count:media.length,
    categories:[],
    deeper:"",
    learning:[]
  };
}
