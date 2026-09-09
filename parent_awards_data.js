const XANO_BASE_URL="https://x8ki-letl-twmt.n7.xano.io/api:ro6SX8PH";

let awardsData=null;
let awardsPromise=null;

/*   load awards data*/
export async function loadAwardsData(){
  if(awardsData){return awardsData;}
  if(awardsPromise){return awardsPromise;}

  const authToken=localStorage.getItem("authToken");
  awardsPromise=(async()=>{
    const response=await fetch(`${XANO_BASE_URL}/pa_get_awards`,{
      method:"GET",
      headers:{Authorization:`Bearer ${authToken}`}
    });
    const data=await response.json();
    if(!response.ok){throw new Error(data.message||"Unable to load awards.");}
    awardsData=data;
    return data;
  })();

  try{return await awardsPromise;}
  finally{awardsPromise=null;}
}

/*   get awards data*/
export function getAwardsData(){return awardsData;}

/*   get badge catalogue*/
export function getAwardBadges(){
  return Array.isArray(awardsData?.badges)?awardsData.badges:[];
}

/*   get earned student badges*/
export function getStudentBadges(){
  return Array.isArray(awardsData?.student_badges)?awardsData.student_badges:[];
}

/*   get latest award event*/
export function getLatestAwardEvent(){
  const badgeMap=new Map(
    getAwardBadges()
      .filter(item=>item?.is_active!==false)
      .map(item=>[Number(item?.id)||0,item])
  );

  const earned=getStudentBadges()
    .filter(item=>item?.is_active!==false)
    .sort((a,b)=>(Number(b?.earned_at)||0)-(Number(a?.earned_at)||0));

  if(!earned.length){return null;}

  const newest=earned[0];
  const attendanceId=Number(newest?.attendance_id)||0;
  const newestTime=Number(newest?.earned_at)||0;
  const group=earned.filter(item=>{
    if(attendanceId){return Number(item?.attendance_id)===attendanceId;}
    return Math.abs((Number(item?.earned_at)||0)-newestTime)<=300000;
  });

  const awards=group.map(studentBadge=>({
    studentBadge,
    badge:badgeMap.get(Number(studentBadge?.badge_id)||0)||null
  }));

  return{
    attendanceId,
    earnedAt:newestTime,
    awards
  };
}

/*   clear cached awards*/
export function clearAwardsData(){
  awardsData=null;
  awardsPromise=null;
}
