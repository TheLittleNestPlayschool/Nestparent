const XANO_BASE_URL='https://x8ki-letl-twmt.n7.xano.io/api:ro6SX8PH';

let parentData=null;

/*   load parent data*/
export async function loadParentData(){
  const authToken=localStorage.getItem('authToken');

  const response=await fetch(
    `${XANO_BASE_URL}/pa_load_parent`,
    {
      method:'GET',
      headers:{
        'Authorization':`Bearer ${authToken}`
      }
    }
  );

  const data=await response.json();

console.log("PARENT DATA",data);
  
  if(!response.ok){
    throw new Error(
      data.message||
      'Unable to load parent data.'
    );
  }

  parentData=data;

  return data;
}

/*   get parent data*/
export function getParentData(){
  return parentData;
}

/*   get parent*/
export function getParent(){
  return parentData?.parent||null;
}

/*   get student*/
export function getStudent(){
  return parentData?.student||null;
}

/*   get franchise*/
export function getFranchise(){
  return parentData?.franchise||null;
}

/*   get student media*/
export function getStudentMedia(){
  return parentData?.student_medias||[];
}

/*   get current session details*/
export function getCurrentSessionDetails(){
  return parentData?.current_session_details||null;
}

/*   get signed thumbnails*/
export function getSignedThumbnails(){
  return parentData?.signed_thumbnails||[];
}
