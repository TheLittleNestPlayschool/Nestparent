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
    moments:"Moments",
    home:"Together",
    celebration:"Celebration"
  })[type]||"Story";
}

/*   story main card*/
function buildStoryMainCard(item){
  return`
    <div class="card story-main-card">
      <div class="photo story-main-photo" style="background-image:url('${escapeHtml(item.photo)}')"></div>
      <div class="type-mark">Story</div>
      <div class="content story-main-content">
        <div class="moment-label story-main-label">${escapeHtml(item.label||"Today's Story")}</div>
        <h2 class="moment-title story-main-title">${escapeHtml(item.title||"{story_title}")}</h2>
        <p class="moment-copy story-main-copy">${escapeHtml(item.copy||"{story_teaser}")}</p>
      </div>
    </div>
  `;
}

/*   standard main card*/
function buildStandardMainCard(item,typeLabel){
  const categories=Array.isArray(item.categories)?item.categories:[];
  return`
    <div class="card">
      <div class="photo" style="background-image:url('${escapeHtml(item.photo)}')"></div>
      <div class="type-mark">${escapeHtml(typeLabel)}</div>
      <div class="content">
        <div class="moment-label">${escapeHtml(item.label)}</div>
        <h2 class="moment-title">${escapeHtml(item.title)}</h2>
        <p class="moment-copy">${escapeHtml(item.copy)}</p>
        <div class="learn-row">
          ${categories.map(category=>`<span class="learn-pill">${escapeHtml(category)}</span>`).join("")}
        </div>
      </div>
    </div>
  `;
}

/*   create experience card*/
function createExperienceCard(item,index,onOpen){
  const article=document.createElement("article");
  article.className=item?.type==="session"?"experience story-main-experience":"experience";
  article.dataset.index=index;

  const typeLabel=getTypeLabel(item.type);
  article.innerHTML=item?.type==="session"?buildStoryMainCard(item):buildStandardMainCard(item,typeLabel);

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
