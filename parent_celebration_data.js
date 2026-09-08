import{
  getParentData,
  getStudent,
  getStudentMedia,
  getSignedThumbnails
}from"./parent_data.js";

function text(value){return typeof value==="string"?value.trim():"";}
function firstText(...values){return values.map(text).find(Boolean)||"";}
function timestamp(value){let time=Number(value)||0;if(time&&time<1000000000000){time*=1000;}return time;}

function isBirthdayToday(value){
  if(!value){return false;}
  const birthday=new Date(value);
  if(Number.isNaN(birthday.getTime())){return false;}
  const today=new Date();
  return birthday.getMonth()===today.getMonth()&&birthday.getDate()===today.getDate();
}

function getCelebrationExperienceSource(parentData){
  const source=[parentData?.session_experiences,parentData?.session_experience,parentData?.current_session_experiences].find(Array.isArray)||[];
  return source.find(item=>{
    if(item?.is_active===false){return false;}
    const type=text(item?.experience_type).toLowerCase();
    const name=text(item?.experience_name).toLowerCase();
    return["celebration","event","special_event"].includes(type)||/birthday|celebrat|recognition|special day/.test(name);
  })||null;
}

function getLatestPhoto(){
  const media=getStudentMedia()||[];
  const thumbnails=getSignedThumbnails()||[];
  return media
    .map((item,index)=>({item,photo:thumbnails[index]||""}))
    .filter(entry=>entry.photo&&!entry.item?.is_deleted)
    .sort((a,b)=>timestamp(b.item?.created_at)-timestamp(a.item?.created_at))[0]?.photo||"";
}

export function getCelebrationExperience(){
  const parentData=getParentData()||{};
  const student=getStudent()||{};
  const studentName=student?.preferred_name||student?.name||"Your little one";
  const birthday=isBirthdayToday(student?.date_of_birth);
  const source=getCelebrationExperienceSource(parentData);
  const hasLiveCelebration=birthday||Boolean(source);
  const photo=getLatestPhoto();
  const title=birthday?`Happy Birthday, ${studentName}!`:source?firstText(source?.experience_name,"A Special Little Nest Celebration"):`A Special Moment for ${studentName}`;
  const copy=birthday?`Today is a special day for ${studentName}, and we're celebrating right along with you.`:source?firstText(source?.parent_description,source?.experience_summary,source?.class_context,`Something special happened in ${studentName}'s Little Nest day.`):`This Celebration card is staying visible while we shape the Parent App experience.`;
  const message=birthday?`A little day worth celebrating, remembering, and smiling about together.`:source?firstText(source?.parent_description,source?.experience_summary,source?.class_context):`When a birthday, Recognition Day, class celebration, or other special occasion happens, it will become the heart of this experience.`;

  return{
    type:"celebration",
    experience_type_code:"celebration",
    title,
    label:"Celebration",
    copy,
    photo,
    categories:birthday?["Birthday","Special day"]:source?["Special moment","Celebrate together"]:["Special occasion","Celebration"],
    detail:{
      eyebrow:"Celebration",
      title,
      lead:copy,
      message,
      kind:birthday?"birthday":hasLiveCelebration?"special":"preview",
      media:photo?[photo]:[]
    },
    deeper:message,
    learning:[]
  };
}
