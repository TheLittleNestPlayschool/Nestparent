const XANO_BASE_URL=
  'https://x8ki-letl-twmt.n7.xano.io/api:ro6SX8PH';

let awardsData=null;
let awardsPromise=null;

/*   load awards data*/
export async function loadAwardsData(){
  if(awardsData){return awardsData;}
  if(awardsPromise){return awardsPromise;}

  const authToken=
    localStorage.getItem(
      'authToken'
    );

  awardsPromise=(async()=>{
    const response=
      await fetch(
        `${XANO_BASE_URL}/pa_awards`,
        {
          method:'GET',
          headers:{
            'Authorization':
              `Bearer ${authToken}`
          }
        }
      );

    const data=
      await response.json();

    if(!response.ok){
      throw new Error(
        data.message||
        'Unable to load awards.'
      );
    }

    awardsData=data;
    return data;
  })();

  try{
    return await awardsPromise;
  }finally{
    awardsPromise=null;
  }
}

/*   get awards data*/
export function getAwardsData(){return awardsData;}

/*   get development categories*/
export function getAwardCategories(){
  return awardsData?.development_categories||[];
}

/*   get badge catalogue*/
export function getAwardBadges(){
  return awardsData?.badges||[];
}

/*   get earned student badges*/
export function getStudentBadges(){
  return awardsData?.student_badges||[];
}

/*   clear cached awards*/
export function clearAwardsData(){
  awardsData=null;
  awardsPromise=null;
}
