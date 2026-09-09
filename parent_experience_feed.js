import{getExperiences}from"./parent_experiences.js";
import{getCelebrationExperience}from"./parent_celebration_data.js";
import{getLatestAwardEvent}from"./parent_recent_awards_data.js";
import{getStudent}from"./parent_data.js";

const awardCategories={
  1:"Literacy",
  2:"Oral Language",
  3:"Numeracy",
  4:"Gross Motor Skills",
  5:"Fine Motor Skills",
  6:"Creative Arts",
  7:"Personal Growth",
  8:"Listening & Understanding",
  9:"My World"
};

const awardIcons={
  1:"assets/awards/literacy.svg",
  2:"assets/awards/oral_lang.svg",
  3:"assets/awards/numeracy.svg",
  4:"assets/awards/gross_motor.svg",
  5:"assets/awards/fine_motor.svg",
  6:"assets/awards/creative_arts.svg",
  7:"assets/awards/personal.svg",
  8:"assets/awards/receptive_lang.svg",
  9:"assets/awards/my_world.svg"
};

/*   build award experience*/
function getAwardExperience(experiences){
  const event=getLatestAwardEvent();
  if(!event?.awards?.length){return null;}

  const student=getStudent()||{};
  const studentName=student?.preferred_name||student?.name||"Your little one";
  const awards=event.awards.map(({studentBadge,badge})=>{
    const categoryId=Number(badge?.development_category_id)||0;
    return{
      name:String(badge?.name||"Award").trim(),
      title:String(badge?.parent_title||"").trim(),
      message:String(badge?.parent_message||studentBadge?.parent_note||studentBadge?.award_reason||"").trim(),
      iconUrl:awardIcons[categoryId]||String(badge?.icon_url||"").trim(),
      category:awardCategories[categoryId]||"",
      level:Number(badge?.level)||0,
      badgeId:Number(studentBadge?.badge_id)||0
    };
  });

  const count=awards.length;
  const categories=[...new Set(awards.map(item=>item.category).filter(Boolean))];
  const first=awards[0];
  const title=count===1
    ?(first.title||`${studentName} earned ${first.name}!`)
    :`A Big Milestone Day for ${studentName}`;
  const copy=count===1
    ?(first.message||`${studentName} reached a new Little Nest milestone.`)
    :`${studentName} reached ${count} new milestones${categories.length?` across ${categories.join(", ")}`:""}.`;

  return{
    type:"award",
    experience_type_code:"award",
    title,
    label:"Award",
    copy,
    photo:experiences[0]?.photo||"",
    award_count:count,
    award_items:awards,
    award_earned_at:event.earnedAt,
    categories:[],
    deeper:"",
    learning:[]
  };
}

export function getParentExperiences(){
  const experiences=getExperiences();
  const award=getAwardExperience(experiences);
  const celebration=getCelebrationExperience();
  const result=[...experiences];
  if(award){result.push(award);}
  if(celebration){result.push(celebration);}
  return result;
}
