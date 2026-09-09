/*   escape html*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function buildActionRows(actions){
  if(!actions.length){return"";}
  return`
    <section class="activity-detail-section activity-detail-actions">
      <div class="activity-detail-section-head">
        <div class="activity-detail-kicker">What We Did</div>
        <p>The simple steps that shaped the activity.</p>
      </div>
      <div class="activity-detail-rows">
        ${actions.map(item=>`
          <article class="activity-detail-row">
            ${item.title?`<h3>${escapeHtml(item.title)}</h3>`:""}
            ${item.copy?`<p>${escapeHtml(item.copy)}</p>`:""}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function buildInfoCard(item,className){
  if(!item?.title&&!item?.copy){return"";}
  return`
    <section class="activity-detail-info ${className}">
      ${item.title?`<h3>${escapeHtml(item.title)}</h3>`:""}
      ${item.copy?`<p>${escapeHtml(item.copy)}</p>`:""}
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
  const hero=item?.photo||"";
  const actions=Array.isArray(detail.actions)?detail.actions:[];

  article.innerHTML=`
    <div class="card activity-detail-card">
      <div class="type-mark">ACTIVITY</div>
      <div class="activity-detail-hero" style="background-image:url('${escapeHtml(hero)}')"></div>
      <div class="activity-detail-hero-shade"></div>
      <div class="activity-detail-scroll">
        <header class="activity-detail-header">
          <h2>${escapeHtml(title)}</h2>
          ${lead?`<p class="activity-detail-lead">${escapeHtml(lead)}</p>`:""}
        </header>
        <div class="activity-detail-body">
          ${buildActionRows(actions)}
          <div class="activity-detail-support">
            ${buildInfoCard(detail.materials,"activity-detail-materials")}
            ${buildInfoCard(detail.teacherContext,"activity-detail-teacher-context")}
          </div>
        </div>
      </div>
    </div>
  `;

  return article;
}
