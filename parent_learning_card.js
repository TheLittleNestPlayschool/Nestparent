/*   escape html*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/*   explored*/
function buildExplored(items){
  if(!items.length){return"";}
  return`
    <section class="learning-detail-section">
      <div class="learning-detail-kicker">What We Explored</div>
      <div class="learning-detail-explored">
        ${items.map(item=>`
          <article class="learning-detail-item">
            ${item.title?`<h3>${escapeHtml(item.title)}</h3>`:""}
            ${item.copy?`<p>${escapeHtml(item.copy)}</p>`:""}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

/*   connections*/
function buildConnections(items){
  if(!items.length){return"";}
  return`
    <section class="learning-detail-section">
      <div class="learning-detail-kicker">Learning Connections</div>
      <div class="learning-detail-connections">
        ${items.map(item=>`
          <article class="learning-detail-item">
            ${item.title?`<h3>${escapeHtml(item.title)}</h3>`:""}
            ${item.copy?`<p>${escapeHtml(item.copy)}</p>`:""}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

/*   media*/
function buildMedia(media){
  if(!media.length){return"";}
  return`
    <section class="learning-detail-section learning-detail-media-section">
      <div class="learning-detail-media">
        ${media.slice(0,4).map((url,index)=>`
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
  const explored=Array.isArray(detail.explored)?detail.explored:[];
  const connections=Array.isArray(detail.connections)?detail.connections:[];
  const media=Array.isArray(detail.media)?detail.media:[];

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
          ${buildMedia(media)}
        </div>
      </div>
    </div>
  `;

  return article;
}
