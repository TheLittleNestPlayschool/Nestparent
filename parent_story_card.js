/*   escape html*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/*   little details*/
function buildLittleDetails(details){
  if(!details.length){return"";}
  const symbols=["✦","•","✧"];
  return`
    <section class="story-detail-section story-detail-little-details">
      <div class="story-detail-kicker">Little Details</div>
      <p class="story-detail-section-intro">A few little pieces that helped shape the morning.</p>
      <div class="story-detail-detail-list">
        ${details.slice(0,3).map((detail,index)=>{
          if(detail&&typeof detail==="object"){
            const title=detail.title||detail.label||"";
            const copy=detail.copy||detail.description||"";
            return`<article class="story-detail-detail"><span class="story-detail-detail-mark" aria-hidden="true">${symbols[index]}</span><div>${title?`<h3>${escapeHtml(title)}</h3>`:""}${copy?`<p>${escapeHtml(copy)}</p>`:""}</div></article>`;
          }
          return`<article class="story-detail-detail"><span class="story-detail-detail-mark" aria-hidden="true">${symbols[index]}</span><div><p>${escapeHtml(detail)}</p></div></article>`;
        }).join("")}
      </div>
    </section>
  `;
}

/*   teacher context*/
function buildTeacherDetails(details){
  if(!details.length){return"";}
  return`
    <section class="story-detail-section story-detail-classroom">
      <div class="story-detail-kicker">From The Classroom</div>
      <div class="story-detail-notes">
        ${details.slice(0,3).map(item=>`
          <article class="story-detail-note">
            ${item?.title?`<h3>${escapeHtml(item.title)}</h3>`:""}
            ${item?.copy?`<p>${escapeHtml(item.copy)}</p>`:""}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

/*   story media*/
function buildMedia(media){
  if(!media.length){return"";}
  return`
    <section class="story-detail-section story-detail-media-section">
      <div class="story-detail-kicker">From Today</div>
      <div class="story-detail-media">
        ${media.slice(0,4).map((url,index)=>`
          <div class="story-detail-photo${index===0?" is-primary":""}" style="background-image:url('${escapeHtml(url)}')"></div>
        `).join("")}
      </div>
    </section>
  `;
}

/*   create expanded story card*/
export function createStoryCard(item){
  const detail=item?.detail||{};
  const article=document.createElement("article");
  article.className="experience story-detail-experience";
  article.dataset.experienceType="story-detail";

  const title=detail.title||item?.title||"{story_title}";
  const lead=detail.lead||item?.copy||"{story_intro}";
  const narrative=detail.narrative||"{story_full_narrative}";
  const hero=item?.photo||detail.media?.[0]||"";
  const littleDetails=Array.isArray(detail.littleDetails)?detail.littleDetails:Array.isArray(detail.classDetails)?detail.classDetails:[];
  const teacherDetails=Array.isArray(detail.teacherDetails)?detail.teacherDetails:[];
  const media=Array.isArray(detail.media)?detail.media:[];

  article.innerHTML=`
    <div class="card story-detail-card">
      <div class="story-detail-hero" style="background-image:url('${escapeHtml(hero)}')"></div>
      <div class="story-detail-hero-shade"></div>
      <div class="type-mark">Story</div>
      <div class="story-detail-scroll">
        <header class="story-detail-header">
          <div class="story-detail-label">${escapeHtml(detail.eyebrow||"Today's Story")}</div>
          <h2>${escapeHtml(title)}</h2>
          <p class="story-detail-lead">${escapeHtml(lead)}</p>
        </header>
        <div class="story-detail-body">
          <section class="story-detail-section story-detail-narrative">
            <div class="story-detail-kicker">The Story</div>
            <p>${escapeHtml(narrative)}</p>
          </section>
          ${buildLittleDetails(littleDetails)}
          ${buildMedia(media)}
          ${buildTeacherDetails(teacherDetails)}
        </div>
      </div>
    </div>
  `;

  return article;
}
