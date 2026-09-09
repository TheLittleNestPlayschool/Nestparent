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
    celebration:"Celebration",
    award:"Award"
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

/*   celebration card*/
function buildCelebrationCard(item,typeLabel){
  const media=Array.isArray(item?.celebration_media)?item.celebration_media:[];
  const mediaItems=media.map((entry,index)=>{
    const kind=String(entry?.kind||"media").toLowerCase();
    const hasImage=Boolean(entry?.url);
    const mediaId=Number(entry?.id)||0;
    return`
      <div class="celebration-media-item${hasImage?" has-image":""}"${mediaId?` data-celebration-media-id="${mediaId}" data-media-id="${mediaId}"`:""}${hasImage?` style="background-image:url('${escapeHtml(entry.url)}')"`:""}>
        ${kind==="video"?`<span class="celebration-media-play">▶</span>`:""}
        ${!hasImage?`<span class="celebration-media-kind">${kind==="video"?"Video":"Photo"} ${index+1}</span>`:""}
      </div>
    `;
  }).join("");

  return`
    <div class="card main-stage-card celebration-main-card">
      <div class="photo" style="background-image:url('${escapeHtml(item.photo)}')"></div>
      <div class="type-mark">${escapeHtml(typeLabel)}</div>
      <div class="content main-stage-content celebration-main-content">
        <h2 class="moment-title main-stage-title">${escapeHtml(item.title||"")}</h2>
        ${item?.celebration_parent_title?`<div class="celebration-parent-title">${escapeHtml(item.celebration_parent_title)}</div>`:""}
        <p class="moment-copy main-stage-copy">${escapeHtml(item.copy||"")}</p>
        ${mediaItems?`
          <div class="celebration-media-head">
            <span>From the celebration</span>
            <strong>${media.length} ${media.length===1?"memory":"memories"}</strong>
          </div>
          <div class="celebration-media-strip">${mediaItems}</div>
        `:""}
      </div>
    </div>
  `;
}

/*   award card*/
function buildAwardCard(item,typeLabel){
  const awards=Array.isArray(item?.award_items)?item.award_items:[];
  const awardRows=awards.map((award,index)=>{
    const icon=award?.iconUrl
      ?`<span class="award-main-icon has-image" style="background-image:url('${escapeHtml(award.iconUrl)}')"></span>`
      :`<span class="award-main-icon">★</span>`;
    return`
      <div class="award-main-item${index===0?" is-first":""}">
        ${icon}
        <div class="award-main-item-copy">
          <strong>${escapeHtml(award?.name||"Award")}</strong>
          ${award?.category?`<span>${escapeHtml(award.category)}</span>`:""}
        </div>
      </div>
    `;
  }).join("");

  return`
    <div class="card main-stage-card award-main-card">
      <div class="photo" style="background-image:url('${escapeHtml(item.photo)}')"></div>
      <div class="type-mark">${escapeHtml(typeLabel)}</div>
      <div class="content main-stage-content award-main-content">
        <div class="award-main-crown">✦</div>
        <h2 class="moment-title main-stage-title">${escapeHtml(item.title||"")}</h2>
        <p class="moment-copy main-stage-copy">${escapeHtml(item.copy||"")}</p>
        ${awardRows?`<div class="award-main-list">${awardRows}</div>`:""}
      </div>
    </div>
  `;
}

/*   main card*/
function buildMainCard(item,typeLabel){
  if(item?.type==="home"){
    return buildTogetherCard(item,typeLabel);
  }
  if(item?.type==="celebration"){
    return buildCelebrationCard(item,typeLabel);
  }
  if(item?.type==="award"){
    return buildAwardCard(item,typeLabel);
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
