import{getParent}from"./parent_data.js";

const XANO_BASE_URL="https://x58r-xped-p4y6.n7e.xano.io/api:ro6SX8PH";
let languages=[];
let selectedLanguageId=null;

/*   normalize language list*/
function normalizeLanguages(data){
  if(Array.isArray(data))return data;
  if(Array.isArray(data?.pa_language))return data.pa_language;
  if(Array.isArray(data?.languages))return data.languages;
  if(Array.isArray(data?.pa_languages))return data.pa_languages;
  if(Array.isArray(data?.items))return data.items;
  return[];
}

/*   language label*/
export function getLanguageLabel(language){
  return language?.language_name||language?.name||language?.language||language?.display_name||"Language";
}

/*   language code*/
export function getLanguageCode(language){
  return language?.language_code||language?.code||language?.locale||"";
}

/*   language native name*/
export function getLanguageNativeName(language){
  const nativeName=language?.native_name||language?.native_language_name||"";
  const label=getLanguageLabel(language);
  return nativeName&&nativeName!==label?nativeName:"";
}

/*   parent language id*/
function getSavedParentLanguageId(){
  const parent=getParent();
  const value=parent?.parent_language??parent?.pa_language_id;
  if(value===undefined||value===null||value==="")return null;
  const languageId=Number(value);
  return Number.isInteger(languageId)&&languageId>0?languageId:null;
}

/*   load languages*/
export async function loadParentLanguages(){
  const authToken=localStorage.getItem("authToken");
  const response=await fetch(`${XANO_BASE_URL}/pa_get_languages`,{
    method:"GET",
    headers:{Authorization:`Bearer ${authToken}`}
  });
  const data=await response.json();
  if(!response.ok){
    throw new Error(data?.message||"Unable to load languages.");
  }
  languages=normalizeLanguages(data)
    .filter(language=>language?.active!==false)
    .sort((a,b)=>{
      const aOrder=Number(a?.sort_order??9999);
      const bOrder=Number(b?.sort_order??9999);
      if(aOrder!==bOrder)return aOrder-bOrder;
      return getLanguageLabel(a).localeCompare(getLanguageLabel(b));
    });
  if(selectedLanguageId===null){
    selectedLanguageId=getSavedParentLanguageId();
  }
  return languages;
}

/*   update parent language*/
export async function updateParentLanguage(parentLanguage){
  const languageId=Number(parentLanguage);
  if(!Number.isInteger(languageId)||languageId<=0){
    throw new Error("Please choose a valid language.");
  }
  const authToken=localStorage.getItem("authToken");
  const response=await fetch(`${XANO_BASE_URL}/pa_update_parent_language`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${authToken}`
    },
    body:JSON.stringify({parent_language:languageId})
  });
  const data=await response.json();
  if(!response.ok){
    throw new Error(data?.message||"Unable to save your language.");
  }
  selectedLanguageId=languageId;
  const parent=getParent();
  if(parent)parent.parent_language=languageId;
  return data;
}

/*   language state*/
export function getParentLanguages(){return languages;}
export function getSelectedLanguageId(){
  if(selectedLanguageId!==null)return selectedLanguageId;
  return getSavedParentLanguageId();
}
