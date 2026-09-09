import{
  getParentExperiences
}from"./parent_experience_feed.js";

/*   escape html*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/*   get card type label*/
function getTypeLabel(type){
  return({
    session:"Story",
    learning:"Learning",
    activity:"Activity",
    personal:"Growth",
    moments:"Moment",
    home:"Together",
    celebration:"Celebration"
  })[type]||"Story";
}

/*   get card type class*/
function getTypeClass(type){
  return({
    session:"story",
    learning:"learning",
    activity:"activity",
    personal:"growth",
    moments:"moments",
    home:"together",
    celebration:"celebration",
    award:"award"
  })[type]||"story";
}

/*   together card*/
function buildTogetherCard(item,typeLabel){
  const prompt=item?.together_prompt||"";
  const activity=item?.together_activity||"";
  return`
    <div class="card main-stage-card together-main-card">
      <div class="photo" style="background-image:url('${escapeHtml(item.photo)}')"></div>
      <div class="type-mark">${escapeHtml(typeLabel)}</div>
      <div class="content main-stage-content together-main-content">
        <h2 class="moment-title main-stage-title">${escapeHtml(item.title||"")}</h2>
        ${prompt?`<div class="together-main-prompt">${escapeHtml(prompt)}</div>`:""}
        ${activity?`
          <div class="together-main-activity">
            <span>Try This Together</span>
            <p>${escapeHtml(activity)}</p>
          </div>
        `:""}
        ${!prompt&&!activity?`<p class="moment-copy main-stage-copy">${escapeHtml(item.copy||"")}</p>`:""}
      </div>
    </div>
  `;
}

/*   main card*/
function buildMainCard(item,typeLabel){
  if(item?.type==="home"){
    return buildTogetherCard(item,typeLabel);
  }

  return`
    <div class="card main-stage-card${item?.type==="moments"?" moments-main-card":""}">
      <div class="photo" style="background-image:url('${escapeHtml(item.photo)}')"></div>
      <div class="type-mark">${escapeHtml(typeLabel)}</div>
      <div class="content main-stage-content">
        <h2 class="moment-title main-stage-title">${escapeHtml(item.title||"")}</h2>
        <p class="moment-copy main-stage-copy">${escapeHtml(item.copy||"")}</p>
      </div>
    </div>
  `;
}

/*   create experience card*/
function createExperienceCard(item,index,onOpen){
  const article=document.createElement("article");
  const typeClass=getTypeClass(item?.type);
  article.className=`experience experience-${typeClass}${item?.type==="session"?" story-main-experience":""}`;
  article.dataset.index=index;

  const typeLabel=getTypeLabel(item.type);
  article.innerHTML=buildMainCard(item,typeLabel);

  article.addEventListener("click",()=>{
    if(typeof onOpen==="function"){onOpen(index);}
  });

  return article;
}

/*   build experience cards*/
export function buildExperienceCards(carousel,onOpen){
  if(!carousel){return;}
  const experiences=getParentExperiences();
  experiences.forEach((item,index)=>{
    const card=createExperienceCard(item,index,onOpen);
    carousel.appendChild(card);
  });
}
