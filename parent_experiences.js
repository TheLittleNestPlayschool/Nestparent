import{
  getStudent,
  getCurrentSessionDetails,
  getStudentMedia,
  getSignedThumbnails
}from"./parent_data.js";

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
  ["oral_language","Oral Language"],
  ["numeracy","Numeracy"],
  ["gross_motor","Gross Motor"],
  ["fine_motor","Fine Motor"],
  ["creative_arts","Creative Arts"],
  ["personal","Personal Growth"],
  ["receptive_language","Receptive Language"],
  ["my_world","My World"]
];

function getMediaTimestamp(value){
  let timestamp=Number(value)||0;
  if(timestamp&&timestamp<1000000000000){
    timestamp*=1000;
  }
  return timestamp;
}

function isToday(value){
  const timestamp=getMediaTimestamp(value);
  if(!timestamp){
    return false;
  }
  const date=new Date(timestamp);
  const now=new Date();
  return date.getFullYear()===now.getFullYear()&&
    date.getMonth()===now.getMonth()&&
    date.getDate()===now.getDate();
}

function getLatestMedia(media,thumbnails){
  return media
    .map((item,index)=>({
      item,
      thumbnail:thumbnails[index]||""
    }))
    .filter(entry=>entry.thumbnail&&!entry.item?.is_deleted)
    .sort((a,b)=>
      getMediaTimestamp(b.item?.created_at)-
      getMediaTimestamp(a.item?.created_at)
    );
}

function getUniquePhotos(entries){
  const seen=new Set();
  return entries
    .filter(entry=>{
      if(seen.has(entry.thumbnail)){
        return false;
      }
      seen.add(entry.thumbnail);
      return true;
    })
    .map(entry=>entry.thumbnail);
}

function getExperiencePhoto(livePhotos,index){
  if(livePhotos.length){
    return livePhotos[index%livePhotos.length];
  }
  return fallbackPhotos[index];
}

function getText(value){
  return typeof value==="string"
    ?value.trim()
    :"";
}

function firstText(...values){
  return values
    .map(getText)
    .find(Boolean)||"";
}

function getGrowthWeights(session){
  const source=session?.category_weights;
  let weights={};

  if(source&&typeof source==="object"&&!Array.isArray(source)){
    weights=source;
  }else if(typeof source==="string"){
    try{
      const parsed=JSON.parse(source);
      if(parsed&&typeof parsed==="object"){
        weights=parsed;
      }
    }catch(error){
      weights={};
    }
  }

  return growthCategories
    .map(([key,label])=>{
      const aliases={
        oral_language:["oral_language","oral_lang"],
        receptive_language:["receptive_language","receptive_lang"]
      }[key]||[key];

      const value=aliases
        .map(alias=>
          Number(
            weights?.[alias]??
            session?.[alias]??
            session?.[`${alias}_weight`]??
            0
          )
        )
        .find(number=>Number.isFinite(number)&&number>0)||0;

      return{key,label,value};
    })
    .filter(item=>item.value>0)
    .sort((a,b)=>b.value-a.value);
}

function buildGoalCopy(objectives,studentName){
  if(objectives.length){
    return objectives.slice(0,2).join(" ");
  }
  return `Today's learning gave ${studentName} a few clear things to explore and practice.`;
}

/*   build experiences*/
export function getExperiences(){
  const student=getStudent();
  const session=getCurrentSessionDetails()||{};
  const media=getStudentMedia();
  const thumbnails=getSignedThumbnails();
  const latestMedia=getLatestMedia(media,thumbnails);
  const livePhotos=getUniquePhotos(latestMedia);
  const todayMedia=latestMedia.filter(entry=>isToday(entry.item?.created_at));
  const todayPhotos=getUniquePhotos(todayMedia);

  const studentName=
    student?.preferred_name||
    student?.name||
    "Your little one";

  const lessonOne=getText(session?.lesson_1_title);
  const lessonTwo=getText(session?.lesson_2_title);
  const manner=getText(session?.manner_topic);
  const objectives=[
    getText(session?.obj_text_1),
    getText(session?.obj_text_2),
    getText(session?.obj_text_3)
  ].filter(Boolean);
  const learningTopics=[lessonOne,lessonTwo,manner].filter(Boolean);

  const storyTitle=firstText(
    session?.session_plan_name,
    session?.todays_description,
    learningTopics.length
      ?learningTopics.join(", ")
      :`${studentName}'s day at The Little Nest`
  );

  const storyCopy=firstText(
    session?.todays_description,
    session?.session_description,
    `A little look at what was woven into ${studentName}'s day.`
  );

  const physicalActivity=firstText(
    session?.physical_activity,
    session?.activity_title,
    session?.activity_name
  );

  const growthWeights=getGrowthWeights(session);
  const strongestGrowth=growthWeights.slice(0,3);
  const strongestGrowthName=strongestGrowth[0]?.label||"growing skills";

  const todayCount=todayMedia.length;
  const todayMomentWord=todayCount===1?"moment":"moments";
  const todayPhoto=todayPhotos[0]||fallbackPhotos[4];

  const homeActivity=getText(session?.home_time_activity);
  const nextDescription=getText(session?.next_description);
  const togetherHasHome=Boolean(homeActivity);

  return[
    {
      type:"session",
      experience_type_code:"today_story",
      title:storyTitle,
      label:"Today's Story",
      copy:storyCopy,
      photo:getExperiencePhoto(livePhotos,0),
      categories:learningTopics.slice(0,3),
      deeper:firstText(session?.full_lesson_plan,session?.session_description),
      learning:[
        ["🔤",lessonOne,getText(session?.obj_text_1)],
        ["🔢",lessonTwo,getText(session?.obj_text_2)],
        ["🌿",manner,getText(session?.obj_text_3)]
      ].filter(item=>item[1])
    },
    {
      type:"learning",
      experience_type_code:"learning_discovery",
      title:"What today's learning was building.",
      label:"Learning Discovery",
      copy:buildGoalCopy(objectives,studentName),
      photo:getExperiencePhoto(livePhotos,1),
      categories:learningTopics.slice(0,3),
      deeper:objectives.join(" "),
      learning:[
        ["✨",lessonOne||"Learning goal",getText(session?.obj_text_1)],
        ["✨",lessonTwo||"Learning goal",getText(session?.obj_text_2)],
        ["✨",manner||"Learning goal",getText(session?.obj_text_3)]
      ].filter(item=>item[2])
    },
    {
      type:"activity",
      experience_type_code:"activity",
      title:physicalActivity||"A little look at what they did.",
      label:"What We Did",
      copy:physicalActivity
        ?`${studentName} had this activity woven into today's session.`
        :`Today's session gave ${studentName} something concrete to do, move through and join in.`,
      photo:getExperiencePhoto(livePhotos,2),
      categories:[physicalActivity,lessonOne,lessonTwo].filter(Boolean).slice(0,3),
      deeper:firstText(session?.full_lesson_plan,session?.session_description),
      learning:[
        ["🎈",physicalActivity||"Today's activity","A concrete part of today's classroom experience."],
        ["💬","Participation","A chance to join in with the group experience."],
        ["✨","Learning by doing","A hands-on part of the session."]
      ]
    },
    {
      type:"personal",
      experience_type_code:"growth",
      title:`Today gave ${studentName} chances to grow through ${strongestGrowthName.toLowerCase()}.`,
      label:"Growth",
      copy:strongestGrowth.length
        ?`The strongest developmental threads today were ${strongestGrowth.map(item=>item.label).join(", ")}.`
        :`Today's session created opportunities for ${studentName} to practice a mix of growing skills.`,
      photo:getExperiencePhoto(livePhotos,3),
      categories:strongestGrowth.map(item=>item.label),
      deeper:"The Growth card is driven by today's nine developmental category weights. These describe what the session emphasized, not a claim that the child mastered the skill today.",
      learning:strongestGrowth.map(item=>[
        "🌱",
        item.label,
        `Today's session placed a ${item.value} weight on ${item.label.toLowerCase()}.`
      ])
    },
    {
      type:"moments",
      experience_type_code:"moments",
      title:todayCount
        ?`${todayCount} little ${todayMomentWord} from today.`
        :"Today's moments are coming soon!",
      label:"Today's Moments",
      copy:todayCount
        ?`A little of ${studentName}'s day is ready to look through.`
        :"As today's little moments arrive, they'll gather here for you.",
      photo:todayPhoto,
      categories:todayCount
        ?[`${todayCount} ${todayMomentWord}`,"Photos & videos"]
        :["Today","Moments"],
      deeper:"",
      destination:"memories_today",
      learning:[]
    },
    {
      type:"home",
      experience_type_code:"together",
      title:togetherHasHome
        ?"One tiny bridge back home."
        :"A little look at what comes next.",
      label:togetherHasHome
        ?"Together"
        :"Coming Up",
      copy:togetherHasHome
        ?homeActivity
        :nextDescription||`A gentle way to stay connected with ${studentName}'s Little Nest journey.`,
      photo:getExperiencePhoto(livePhotos,5),
      categories:togetherHasHome
        ?["At home","Keep it playful"]
        :["Coming next"],
      deeper:togetherHasHome
        ?"This comes directly from the session's home-time activity and should always feel optional and light."
        :nextDescription,
      learning:togetherHasHome
        ?[["🏡","At home",homeActivity]]
        :nextDescription
          ?[["→","Coming next",nextDescription]]
          :[]
    }
  ];
}
