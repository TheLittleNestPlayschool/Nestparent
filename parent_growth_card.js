/*   escape html*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function buildProgress(items,heading,text){
  if(!items.length&&!heading&&!text){return"";}
  const max=Math.max(...items.map(item=>Number(item.value)||0),1);
  return`
    <section class="growth-detail-section growth-detail-current">
      <div class="growth-detail-section-head">
        ${heading?`<div class="growth-detail-kicker">${escapeHtml(heading)}</div>`:""}
        ${text?`<p>${escapeHtml(text)}</p>`:""}
      </div>
      ${items.length?`
        <div class="growth-detail-progress">
          ${items.map(item=>{
            const value=Number(item.value)||0;
            const width=Math.max(10,Math.min(100,(value/max)*100));
            return`
              <div class="growth-progress-row">
                <div class="growth-progress-head"><span>${escapeHtml(item.label)}</span><span>${escapeHtml(value)}</span></div>
                <div class="growth-progress-track"><span style="width:${width}%"></span></div>
              </div>
            `;
          }).join("")}
        </div>
      `:""}
    </section>
  `;
}

function buildContributions(items){
  if(!items.length){return"";}
  return`
    <section class="growth-detail-section growth-detail-contributions">
      <div class="growth-detail-section-head">
        <div class="growth-detail-kicker">What Today Supported</div>
      </div>
      <div class="growth-detail-rows">
        ${items.map(item=>`
          <article class="growth-detail-row">
            ${item.title?`<h3>${escapeHtml(item.title)}</h3>`:""}
            ${item.copy?`<p>${escapeHtml(item.copy)}</p>`:""}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function buildPersonalEvidence(item){
  if(!item?.title&&!item?.copy){return"";}
  return`
    <section class="growth-detail-section growth-detail-evidence">
      <article class="growth-detail-info">
        ${item.title?`<h3>${escapeHtml(item.title)}</h3>`:""}
        ${item.copy?`<p>${escapeHtml(item.copy)}</p>`:""}
      </article>
    </section>
  `;
}

/*   create expanded growth card*/
export function createGrowthCard(item){
  const detail=item?.detail||{};
  const article=document.createElement("article");
  article.className="experience growth-detail-experience";
  article.dataset.experienceType="growth-detail";

  const title=detail.title||item?.title||"Growth";
  const lead=detail.lead||item?.copy||"";
  const hero=item?.photo||"";
  const current=Array.isArray(detail.current)?detail.current:[];
  const contributions=Array.isArray(detail.contributions)?detail.contributions:[];

  article.innerHTML=`
    <div class="card growth-detail-card">
      <div class="type-mark">GROWTH</div>
      <div class="growth-detail-hero" style="background-image:url('${escapeHtml(hero)}')"></div>
      <div class="growth-detail-hero-shade"></div>
      <div class="growth-detail-scroll">
        <header class="growth-detail-header">
          <h2>${escapeHtml(title)}</h2>
          ${lead?`<p class="growth-detail-lead">${escapeHtml(lead)}</p>`:""}
        </header>
        <div class="growth-detail-body">
          ${buildProgress(current,detail.currentHeading||"",detail.currentText||"")}
          ${buildContributions(contributions)}
          ${buildPersonalEvidence(detail.personalEvidence)}
        </div>
      </div>
    </div>
  `;

  return article;
}
