import{getAwardBadges}from"./parent_awards_data.js";

const XANO_BASE_URL="https://x8ki-letl-twmt.n7.xano.io/api:ro6SX8PH";

let recentAwardsData=null;
let recentAwardsPromise=null;

/*   load recent awards*/
export async function loadRecentAwardsData(){
  if(recentAwardsData){return recentAwardsData;}
  if(recentAwardsPromise){return recentAwardsPromise;}

  const authToken=localStorage.getItem("authToken");
  recentAwardsPromise=(async()=>{
    const response=await fetch(`${XANO_BASE_URL}/pa_get_awards`,{
      method:"GET",
      headers:{Authorization:`Bearer ${authToken}`}
    });
    const data=await response.json();
    if(!response.ok){throw new Error(data.message||"Unable to load recent awards.");}
    recentAwardsData=data;
    return data;
  })();

  try{return await recentAwardsPromise;}
  finally{recentAwardsPromise=null;}
}

/*   get recent student badges*/
export function getRecentStudentBadges(){
  return Array.isArray(recentAwardsData?.student_badges)?recentAwardsData.student_badges:[];
}

/*   get latest award event*/
export function getLatestAwardEvent(){
  const badgeMap=new Map(
    getAwardBadges()
      .filter(item=>item?.is_active!==false)
      .map(item=>[Number(item?.id)||0,item])
  );
  const earned=getRecentStudentBadges()
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

  return{
    attendanceId,
    earnedAt:newestTime,
    awards:group.map(studentBadge=>({
      studentBadge,
      badge:badgeMap.get(Number(studentBadge?.badge_id)||0)||null
    }))
  };
}

/*   clear recent awards*/
export function clearRecentAwardsData(){
  recentAwardsData=null;
  recentAwardsPromise=null;
}
