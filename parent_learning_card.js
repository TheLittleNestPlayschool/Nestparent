/*   escape html*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/*   learning rows*/
function buildRows(items,type){
  if(!items.length){return"";}
  return items.map(item=>`
    <article class="learning-detail-row learning-detail-row-${type}">
      <div class="learning-detail-row-copy">
        ${item.title?`<h3>${escapeHtml(item.title)}</h3>`:""}
        ${item.copy?`<p>${escapeHtml(item.copy)}</p>`:""}
      </div>
    </article>
  `).join("");
}

/*   explored*/
function buildExplored(items){
  if(!items.length){return"";}
  return`
    <section class="learning-detail-section learning-detail-explored-section">
      <div class="learning-detail-section-head">
        <div class="learning-detail-kicker">What We Explored</div>
        <p>The ideas and concepts woven through today's learning.</p>
      </div>
      <div class="learning-detail-rows">
        ${buildRows(items,"explored")}
      </div>
    </section>
  `;
}

/*   connections*/
function buildConnections(items){
  if(!items.length){return"";}
  return`
    <section class="learning-detail-section learning-detail-connections-section">
      <div class="learning-detail-rows">
        ${buildRows(items,"connection")}
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
  const explored=Array.isArray(detail.explored)?detail.explored:[];
  const connections=Array.isArray(detail.connections)?detail.connections:[];

  article.innerHTML=`
    <div class="card learning-detail-card">
      <div class="learning-detail-hero" style="background-image:url('${escapeHtml(hero)}')"></div>
      <div class="learning-detail-hero-shade"></div>
      <div class="type-mark">LEARNING</div>
      <div class="learning-detail-scroll">
        <header class="learning-detail-header">
          <h2>${escapeHtml(title)}</h2>
          ${lead?`<p class="learning-detail-lead">${escapeHtml(lead)}</p>`:""}
        </header>
        <div class="learning-detail-body">
          ${buildExplored(explored)}
          ${buildConnections(connections)}
        </div>
      </div>
    </div>
  `;

  return article;
}
