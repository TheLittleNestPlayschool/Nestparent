/*   escape html*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function buildListSection(title,items,className=""){
  if(!items.length){return"";}
  return`
    <section class="activity-detail-section ${className}">
      <div class="activity-detail-kicker">${escapeHtml(title)}</div>
      <div class="activity-detail-list">
        ${items.map(item=>`<span>${escapeHtml(item)}</span>`).join("")}
      </div>
    </section>
  `;
}

function buildMedia(media){
  if(!media.length){return"";}
  return`
    <section class="activity-detail-section">
      <div class="activity-detail-kicker">Little Glimpses</div>
      <div class="activity-detail-media">
        ${media.slice(0,4).map((url,index)=>`<div class="activity-detail-photo${index===0?" is-primary":""}" style="background-image:url('${escapeHtml(url)}')"></div>`).join("")}
      </div>
    </section>
  `;
}

/*   create expanded activity card*/
export function createActivityCard(item){
  const detail=item?.detail||{};
  const article=document.createElement("article");
  article.className="experience activity-detail-experience";
  article.dataset.experienceType="activity-detail";

  const title=detail.title||item?.title||"Today's Activity";
  const lead=detail.lead||item?.copy||"";
  const hero=item?.photo||detail.media?.[0]||"";
  const actions=Array.isArray(detail.actions)?detail.actions:[];
  const materials=Array.isArray(detail.materials)?detail.materials:[];
  const concepts=Array.isArray(detail.concepts)?detail.concepts:[];
  const media=Array.isArray(detail.media)?detail.media:[];

  article.innerHTML=`
    <div class="card activity-detail-card">
      <div class="type-mark">ACTIVITY</div>
      <div class="activity-detail-hero" style="background-image:url('${escapeHtml(hero)}')"></div>
      <div class="activity-detail-hero-shade"></div>
      <div class="activity-detail-scroll">
        <header class="activity-detail-header">
          <div class="activity-detail-label">${escapeHtml(detail.eyebrow||"Activity")}</div>
          <h2>${escapeHtml(title)}</h2>
          ${lead?`<p class="activity-detail-lead">${escapeHtml(lead)}</p>`:""}
        </header>
        <div class="activity-detail-body">
          ${detail.context&&detail.context!==lead?`
            <section class="activity-detail-section activity-detail-context">
              <div class="activity-detail-kicker">What We Did</div>
              <p>${escapeHtml(detail.context)}</p>
            </section>
          `:""}
          ${buildListSection("Actions",actions)}
          ${buildListSection("Materials",materials)}
          ${buildListSection("Learning Through Doing",concepts)}
          ${buildMedia(media)}
        </div>
      </div>
    </div>
  `;

  return article;
}
