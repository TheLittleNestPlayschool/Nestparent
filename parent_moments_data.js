const XANO_BASE_URL="https://x8ki-letl-twmt.n7.xano.io/api:ro6SX8PH";

let momentsData=null;

/*   load student moments*/
export async function loadMomentsData(){
  const authToken=localStorage.getItem("authToken");
  const response=await fetch(`${XANO_BASE_URL}/pa_get_student_moment`,{
    method:"GET",
    headers:{Authorization:`Bearer ${authToken}`}
  });
  const data=await response.json();
  if(!response.ok){throw new Error(data.message||"Unable to load student moments.");}
  momentsData=data;
  return data;
}

/*   get moments data*/
export function getMomentsData(){
  return momentsData;
}

/*   get active student moments*/
export function getStudentMoments(){
  const moments=Array.isArray(momentsData?.student_moment)?momentsData.student_moment:[];
  return moments
    .filter(item=>item?.is_active!==false&&String(item?.moment||"").trim())
    .sort((a,b)=>(Number(b?.created_at)||0)-(Number(a?.created_at)||0));
}

/*   get latest student moment*/
export function getLatestStudentMoment(){
  return getStudentMoments()[0]||null;
}
