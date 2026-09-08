/*   escape html*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/*   objectives*/
function buildObjectives(items){
  if(!items.length){return"";}
  return`
    <section class="learning-detail-section">
      <div class="learning-detail-kicker">What We Explored</div>
      <div class="learning-detail-objectives">
        ${items.map(item=>`<div class="learning-detail-objective">${escapeHtml(item)}</div>`).join("")}
      </div>
    </section>
  `;
}

/*   development*/
function buildDevelopment(items){
  if(!items.length){return"";}
  return`
    <section class="learning-detail-section">
      <div class="learning-detail-kicker">Developmental Connections</div>
      <div class="learning-detail-development">
        ${items.map(item=>`
          <article class="learning-detail-development-item">
            <h3>${escapeHtml(item.label)}</h3>
            ${item.description?`<p>${escapeHtml(item.description)}</p>`:""}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

/*   concepts*/
function buildConcepts(items){
  if(!items.length){return"";}
  return`
    <section class="learning-detail-section">
      <div class="learning-detail-kicker">Learning Threads</div>
      <div class="learning-detail-chips">
        ${items.map(item=>`<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </section>
  `;
}

/*   media*/
function buildMedia(media){
  if(!media.length){return"";}
  return`
    <section class="learning-detail-section learning-detail-media-section">
      <div class="learning-detail-kicker">A Glimpse From Today</div>
      <div class="learning-detail-media">
        ${media.slice(0,3).map((url,index)=>`
          <div class="learning-detail-photo${index===0?" is-primary":""}" style="background-image:url('${escapeHtml(url)}')"></div>
        `).join("")}
      </div>
    </section>
  `;
}

/*   create expanded learning card*/
export function createLearningCard(item){
  const detail=item?.detail||{};
  const article=document.createElement("article");
  article.className="experience learning-detail-experience";
  article.dataset.experienceType="learning-detail";

  const title=detail.title||item?.title||"Today's Learning";
  const lead=detail.lead||item?.copy||"";
  const hero=item?.photo||detail.media?.[0]||"";
  const objectives=Array.isArray(detail.objectives)?detail.objectives:[];
  const development=Array.isArray(detail.development)?detail.development:[];
  const concepts=Array.isArray(detail.concepts)?detail.concepts:[];
  const media=Array.isArray(detail.media)?detail.media:[];

  article.innerHTML=`
    <div class="card learning-detail-card">
      <div class="learning-detail-hero" style="background-image:url('${escapeHtml(hero)}')"></div>
      <div class="learning-detail-hero-shade"></div>
      <div class="learning-detail-scroll">
        <header class="learning-detail-header">
          <div class="learning-detail-label">${escapeHtml(detail.eyebrow||"Learning")}</div>
          <h2>${escapeHtml(title)}</h2>
          ${lead?`<p class="learning-detail-lead">${escapeHtml(lead)}</p>`:""}
        </header>
        <div class="learning-detail-body">
          ${buildObjectives(objectives)}
          ${buildDevelopment(development)}
          ${buildConcepts(concepts)}
          ${buildMedia(media)}
        </div>
      </div>
    </div>
  `;

  return article;
}
