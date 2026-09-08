/*   escape html*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/*   story detail rows*/
function buildClassDetails(details){
  if(!details.length){return"";}
  return`
    <section class="story-detail-section">
      <div class="story-detail-kicker">A Little More From Today</div>
      <div class="story-detail-chips">
        ${details.map(detail=>`<span>${escapeHtml(detail)}</span>`).join("")}
      </div>
    </section>
  `;
}

/*   teacher experiences*/
function buildTeacherDetails(details){
  if(!details.length){return"";}
  return`
    <section class="story-detail-section">
      <div class="story-detail-kicker">What Happened In Class</div>
      <div class="story-detail-notes">
        ${details.map(item=>`
          <article class="story-detail-note">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.copy)}</p>
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
      <div class="story-detail-kicker">Little Glimpses</div>
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

  const title=detail.title||item?.title||"Today's Story";
  const lead=detail.lead||item?.copy||"";
  const narrative=detail.narrative||"";
  const hero=item?.photo||detail.media?.[0]||"";
  const classDetails=Array.isArray(detail.classDetails)?detail.classDetails:[];
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
          ${lead?`<p class="story-detail-lead">${escapeHtml(lead)}</p>`:""}
        </header>
        <div class="story-detail-body">
          ${narrative&&narrative!==lead?`
            <section class="story-detail-section story-detail-narrative">
              <div class="story-detail-kicker">The Story</div>
              <p>${escapeHtml(narrative)}</p>
            </section>
          `:""}
          ${buildTeacherDetails(teacherDetails)}
          ${buildClassDetails(classDetails)}
          ${buildMedia(media)}
        </div>
      </div>
    </div>
  `;

  return article;
}
