import{getExperiences}from"./parent_experiences.js";
import{getCelebrationExperience}from"./parent_celebration_data.js";

export function getParentExperiences(){
  const experiences=getExperiences();
  const celebration=getCelebrationExperience();
  return celebration?[...experiences,celebration]:experiences;
}
