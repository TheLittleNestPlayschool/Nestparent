import{
  getParentData,
  getStudent,
  getCurrentSessionDetails,
  getStudentMedia,
  getSignedThumbnails
}from"./parent_data.js";
import{getLatestStudentMoment}from"./parent_moments_data.js";

/*   experience photos*/
const fallbackPhotos=[
  "https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=1200&q=86",
  "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&w=1200&q=86",
  "https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=1200&q=86",
  "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1200&q=86",
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9e?auto=format&fit=crop&w=1200&q=86",
  "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=1200&q=86"
];

const growthCategories=[
  ["literacy","Literacy"],
  ["oral_lang","Oral Language"],
  ["numeracy","Numeracy"],
  ["gross_motor","Gross Motor"],
  ["fine_motor","Fine Motor"],
  ["creative_arts","Creative Arts"],
  ["personal","Personal Growth"],
  ["receptive_lang","Receptive Language"],
  ["my_world","My World"]
];

function getMediaTimestamp(value){
  let timestamp=Number(value)||0;
  if(timestamp&&timestamp<1000000000000){timestamp*=1000;}
  return timestamp;
}

function isToday(value){
  const timestamp=getMediaTimestamp(value);
  if(!timestamp){return false;}
  const date=new Date(timestamp);
  const now=new Date();
  return date.getFullYear()===now.getFullYear()&&date.getMonth()===now.getMonth()&&date.getDate()===now.getDate();
}

function getLatestMedia(media,thumbnails){
  return media
    .map((item,index)=>({item,thumbnail:thumbnails[index]||""}))
    .filter(entry=>entry.thumbnail&&!entry.item?.is_deleted)
    .sort((a,b)=>getMediaTimestamp(b.item?.created_at)-getMediaTimestamp(a.item?.created_at));
}

function getUniquePhotos(entries){
  const seen=new Set();
  return entries
    .filter(entry=>{
      if(seen.has(entry.thumbnail)){return false;}
      seen.add(entry.thumbnail);
      return true;
    })
    .map(entry=>entry.thumbnail);
}

function getExperiencePhoto(livePhotos,index){
  if(livePhotos.length){return livePhotos[index%livePhotos.length];}
  return fallbackPhotos[index];
}

function getText(value){
  return typeof value==="string"?value.trim():"";
}

function firstText(...values){
  return values.map(getText).find(Boolean)||"";
}

function getJsonList(value){
  if(Array.isArray(value)){return value.filter(Boolean);}
  if(value&&typeof value==="object"){return Object.values(value).filter(Boolean);}
  if(typeof value!=="string"||!value.trim()){return[];}
  try{
    const parsed=JSON.parse(value);
    if(Array.isArray(parsed)){return parsed.filter(Boolean);}
    if(parsed&&typeof parsed==="object"){return Object.values(parsed).filter(Boolean);}
  }catch(error){return[];}
  return[];
}

function getSessionExperiences(parentData,session){
  const candidates=[parentData?.session_experiences,parentData?.session_experience,parentData?.current_session_experiences];
  const source=candidates.find(Array.isArray)||[];
  const sessionId=Number(session?.id)||0;
  return source.filter(item=>{
    if(item?.is_active===false){return false;}
    if(!sessionId){return true;}
    return Number(item?.session_id||item?.session)===sessionId;
  });
}

function getStudentBadges(parentData){
  return [parentData?.student_badges,parentData?.student_badge].find(Array.isArray)||[];
}

/*   parent-facing story*/
function buildStoryTitle(session,studentName){
  return firstText(session?.story_main_heading,session?.session_theme,`${studentName}'s day at The Little Nest`);
}

function buildStoryCopy(session,experiences,studentName){
  const teacherStory=experiences.map(item=>firstText(item?.parent_description,item?.experience_summary)).find(Boolean);
  return firstText(session?.story_main_text,teacherStory,session?.todays_description,`A little look at what was woven into ${studentName}'s day.`);
}

function buildStoryDetail(session,experiences,studentName,photos){
  const teacherDetails=experiences.map(item=>({title:firstText(item?.experience_name,"A class experience"),copy:firstText(item?.parent_description,item?.experience_summary,item?.class_context)})).filter(item=>item.copy);
  const littleDetails=[
    {title:getText(session?.story_detail_1_heading),copy:getText(session?.story_detail_1_text)},
    {title:getText(session?.story_detail_2_heading),copy:getText(session?.story_detail_2_text)},
    {title:getText(session?.story_detail_3_heading),copy:getText(session?.story_detail_3_text)}
  ].filter(item=>item.title||item.copy);
  return{
    eyebrow:"Today's Story",
    title:firstText(session?.story_detail_heading,session?.story_main_heading,`${studentName}'s day at The Little Nest`),
    lead:firstText(session?.story_detail_intro,session?.story_main_text),
    narrative:firstText(session?.story_detail_story,session?.story_detail_intro,session?.story_main_text),
    littleDetails,
    teacherDetails,
    media:photos.slice(0,6)
  };
}

function getGrowthWeights(session){
  const source=session?.category_weights;
  let weights={};
  if(source&&typeof source==="object"&&!Array.isArray(source)){weights=source;}
  else if(typeof source==="string"){
    try{const parsed=JSON.parse(source);if(parsed&&typeof parsed==="object"){weights=parsed;}}catch(error){weights={};}
  }
  return growthCategories.map(([key,label])=>{
    const value=Number(weights?.[key]??session?.[key]??session?.[`${key}_weight`]??0)||0;
    return{key,label,value};
  }).filter(item=>item.value>0).sort((a,b)=>b.value-a.value);
}

function getStudentGrowth(student){
  return growthCategories.map(([key,label])=>({key,label,value:Number(student?.[key]??0)||0})).filter(item=>item.value>0).sort((a,b)=>b.value-a.value);
}

/*   parent-facing learning*/
function buildLearningTitle(session){
  return firstText(session?.learning_main_heading,session?.lesson_1_title,session?.session_theme,"Today's Learning");
}

function buildLearningCopy(session,objectives,studentName){
  return firstText(session?.learning_main_text,objectives[0],`Today's learning gave ${studentName} something clear to explore and practice.`);
}

function buildLearningDetail(session,photos){
  const explored=[
    {title:getText(session?.learning_explored_1_heading),copy:getText(session?.learning_explored_1_text)},
    {title:getText(session?.learning_explored_2_heading),copy:getText(session?.learning_explored_2_text)},
    {title:getText(session?.learning_explored_3_heading),copy:getText(session?.learning_explored_3_text)}
  ].filter(item=>item.title||item.copy);
  const connections=[
    {title:getText(session?.learning_connection_1_heading),copy:getText(session?.learning_connection_1_text)},
    {title:getText(session?.learning_connection_2_heading),copy:getText(session?.learning_connection_2_text)},
    {title:getText(session?.learning_connection_3_heading),copy:getText(session?.learning_connection_3_text)}
  ].filter(item=>item.title||item.copy);
  return{
    title:firstText(session?.learning_detail_heading,session?.learning_main_heading,"Today's Learning"),
    lead:firstText(session?.learning_detail_intro,session?.learning_main_text),
    explored,
    connections,
    media:photos.slice(0,4)
  };
}

/*   parent-facing activity*/
function getActivityExperience(experiences){
  return experiences.find(item=>["activity","mixed"].includes(getText(item?.experience_type).toLowerCase()))||experiences.find(item=>getText(item?.experience_name)||getJsonList(item?.class_actions).length)||null;
}

function buildActivityTitle(session,experience){
  return firstText(session?.activity_main_heading,experience?.experience_name,session?.physical_activity,session?.lesson_1_title,"Today's Activity");
}

function buildActivityCopy(session,experience){
  return firstText(session?.activity_main_text,experience?.parent_description,experience?.experience_summary,session?.physical_activity,session?.worksheet_description,"A hands-on part of today's classroom experience.");
}

function buildActivityDetail(session,experience){
  const actions=[
    {title:getText(session?.activity_action_1_heading),copy:getText(session?.activity_action_1_text)},
    {title:getText(session?.activity_action_2_heading),copy:getText(session?.activity_action_2_text)},
    {title:getText(session?.activity_action_3_heading),copy:getText(session?.activity_action_3_text)}
  ].filter(item=>item.title||item.copy);
  return{
    title:firstText(session?.activity_detail_heading,session?.activity_main_heading,experience?.experience_name,"Today's Activity"),
    lead:firstText(session?.activity_detail_intro,session?.activity_main_text,experience?.parent_description,experience?.experience_summary),
    actions,
    materials:{title:getText(session?.activity_materials_heading),copy:getText(session?.activity_materials_text)},
    teacherContext:{title:getText(session?.activity_teacher_context_heading),copy:getText(session?.activity_teacher_context_text)}
  };
}

/*   parent-facing growth*/
function buildGrowthTitle(session,studentName,studentGrowth){
  return firstText(session?.growth_main_heading,studentGrowth[0]?`${studentGrowth[0].label} is growing`:"",`${studentName}'s growing journey`);
}

function buildGrowthCopy(session,studentName,studentGrowth){
  return firstText(session?.growth_main_text,studentGrowth[0]?`${studentName} has been building experience in ${studentGrowth[0].label.toLowerCase()} over time.`:"",`A look at the developmental experiences building across ${studentName}'s Little Nest journey.`);
}

function buildGrowthDetail(studentGrowth,session){
  const current=studentGrowth.slice(0,4).map(item=>({label:item.label,value:item.value}));
  const contributions=[
    {title:getText(session?.growth_contribution_1_heading),copy:getText(session?.growth_contribution_1_text)},
    {title:getText(session?.growth_contribution_2_heading),copy:getText(session?.growth_contribution_2_text)},
    {title:getText(session?.growth_contribution_3_heading),copy:getText(session?.growth_contribution_3_text)}
  ].filter(item=>item.title||item.copy);
  return{
    title:firstText(session?.growth_detail_heading,session?.growth_main_heading,"Growing Over Time"),
    lead:firstText(session?.growth_detail_intro,session?.growth_main_text),
    currentHeading:firstText(session?.growth_current_heading,"Current Growth"),
    currentText:getText(session?.growth_current_text),
    current,
    contributions,
    personalEvidence:{title:getText(session?.growth_personal_evidence_heading),copy:getText(session?.growth_personal_evidence_text)}
  };
}

/*   build experiences*/
export function getExperiences(){
  const parentData=getParentData()||{};
  const student=getStudent();
  const session=getCurrentSessionDetails()||{};
  const sessionExperiences=getSessionExperiences(parentData,session);
  const studentBadges=getStudentBadges(parentData);
  const media=getStudentMedia();
  const thumbnails=getSignedThumbnails();
  const latestMedia=getLatestMedia(media,thumbnails);
  const livePhotos=getUniquePhotos(latestMedia);
  const todayMedia=latestMedia.filter(entry=>isToday(entry.item?.created_at));
  const todayPhotos=getUniquePhotos(todayMedia);

  const studentName=student?.preferred_name||student?.name||"Your little one";
  const objectives=[getText(session?.obj_text_1),getText(session?.obj_text_2),getText(session?.obj_text_3)].filter(Boolean);

  const storyTitle=buildStoryTitle(session,studentName);
  const storyCopy=buildStoryCopy(session,sessionExperiences,studentName);
  const storyPhoto=todayPhotos[0]||getExperiencePhoto(livePhotos,0);
  const storyMedia=todayPhotos.length?todayPhotos:livePhotos;

  const sessionGrowth=getGrowthWeights(session);
  const studentGrowth=getStudentGrowth(student);
  const latestMoment=getLatestStudentMoment();
  const latestMomentText=getText(latestMoment?.moment);
  const parentPrompt=getText(session?.parent_prompt);
  const homeActivity=getText(session?.home_time_activity);
  const learningPhoto=todayPhotos[1]||todayPhotos[0]||getExperiencePhoto(livePhotos,1);
  const learningMedia=todayPhotos.length?todayPhotos:livePhotos;
  const learningConnections=[getText(session?.learning_connection_1_heading),getText(session?.learning_connection_2_heading),getText(session?.learning_connection_3_heading)].filter(Boolean);
  const activityExperience=getActivityExperience(sessionExperiences);
  const activityPhoto=todayPhotos[2]||todayPhotos[0]||getExperiencePhoto(livePhotos,2);
  const growthPhoto=todayPhotos[3]||todayPhotos[0]||getExperiencePhoto(livePhotos,3);
  const momentPhoto=todayPhotos[0]||getExperiencePhoto(livePhotos,4);

  return[
    {
      type:"session",
      experience_type_code:"today_story",
      title:storyTitle,
      label:"Today's Story",
      copy:storyCopy,
      photo:storyPhoto,
      categories:[],
      detail:buildStoryDetail(session,sessionExperiences,studentName,storyMedia),
      deeper:firstText(session?.story_detail_story,session?.story_detail_intro,session?.story_main_text),
      learning:[]
    },
    {
      type:"learning",
      experience_type_code:"learning_discovery",
      title:buildLearningTitle(session),
      label:"Learning",
      copy:buildLearningCopy(session,objectives,studentName),
      photo:learningPhoto,
      categories:learningConnections.slice(0,2),
      detail:buildLearningDetail(session,learningMedia),
      deeper:firstText(session?.learning_detail_intro,session?.learning_main_text),
      learning:[]
    },
    {
      type:"activity",
      experience_type_code:"activity",
      title:buildActivityTitle(session,activityExperience),
      label:"Activity",
      copy:buildActivityCopy(session,activityExperience),
      photo:activityPhoto,
      categories:[],
      detail:buildActivityDetail(session,activityExperience),
      deeper:firstText(session?.activity_detail_intro,session?.activity_main_text),
      learning:[]
    },
    {
      type:"personal",
      experience_type_code:"growth",
      title:buildGrowthTitle(session,studentName,studentGrowth),
      label:"Growth",
      copy:buildGrowthCopy(session,studentName,studentGrowth),
      photo:growthPhoto,
      categories:[],
      detail:buildGrowthDetail(studentGrowth,session),
      deeper:firstText(session?.growth_detail_intro,session?.growth_main_text),
      learning:[]
    },
    {
      type:"moments",
      experience_type_code:"moments",
      title:latestMomentText?`A little moment from ${studentName}'s day`:`Little moments from ${studentName}'s day`,
      label:"Moment",
      copy:latestMomentText||"When a teacher notices a little moment worth remembering, it will appear here for you.",
      photo:momentPhoto,
      moment_created_at:Number(latestMoment?.created_at)||0,
      moment_id:Number(latestMoment?.id)||0,
      categories:[],
      deeper:"",
      learning:[]
    },
    {
      type:"home",
      experience_type_code:"together",
      title:"A Little Bridge Back Home",
      label:"Together",
      copy:parentPrompt||homeActivity||`A gentle way to stay connected with ${studentName}'s Little Nest journey.`,
      photo:getExperiencePhoto(livePhotos,5),
      together_prompt:parentPrompt,
      together_activity:homeActivity,
      categories:[],
      deeper:"",
      learning:[]
    }
  ];
}