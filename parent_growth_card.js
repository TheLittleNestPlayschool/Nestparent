/*   escape html*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function buildProgress(items){
  if(!items.length){return"";}
  const max=Math.max(...items.map(item=>Number(item.value)||0),1);
  return`
    <section class="growth-detail-section">
      <div class="growth-detail-kicker">Current Growth</div>
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
    </section>
  `;
}

function buildToday(items){
  if(!items.length){return"";}
  return`
    <section class="growth-detail-section">
      <div class="growth-detail-kicker">What Today Supported</div>
      <div class="growth-detail-notes">
        ${items.map(item=>`
          <article class="growth-detail-note">
            <h3>${escapeHtml(item.label)}</h3>
            ${item.description?`<p>${escapeHtml(item.description)}</p>`:""}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function buildMoments(items){
  if(!items.length){return"";}
  return`
    <section class="growth-detail-section">
      <div class="growth-detail-kicker">Teacher Moments</div>
      <div class="growth-detail-moments">
        ${items.map(item=>`<p>${escapeHtml(item)}</p>`).join("")}
      </div>
    </section>
  `;
}

function buildMedia(media){
  if(!media.length){return"";}
  return`
    <section class="growth-detail-section">
      <div class="growth-detail-kicker">Little Glimpses</div>
      <div class="growth-detail-media">
        ${media.slice(0,4).map((url,index)=>`<div class="growth-detail-photo${index===0?" is-primary":""}" style="background-image:url('${escapeHtml(url)}')"></div>`).join("")}
      </div>
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
  const hero=item?.photo||detail.media?.[0]||"";
  const current=Array.isArray(detail.current)?detail.current:[];
  const today=Array.isArray(detail.today)?detail.today:[];
  const moments=Array.isArray(detail.moments)?detail.moments:[];
  const media=Array.isArray(detail.media)?detail.media:[];

  article.innerHTML=`
    <div class="card growth-detail-card">
      <div class="type-mark">GROWTH</div>
      <div class="growth-detail-hero" style="background-image:url('${escapeHtml(hero)}')"></div>
      <div class="growth-detail-hero-shade"></div>
      <div class="growth-detail-scroll">
        <header class="growth-detail-header">
          <div class="growth-detail-label">${escapeHtml(detail.eyebrow||"Growth")}</div>
          <h2>${escapeHtml(title)}</h2>
          ${lead?`<p class="growth-detail-lead">${escapeHtml(lead)}</p>`:""}
        </header>
        <div class="growth-detail-body">
          ${buildProgress(current)}
          ${buildToday(today)}
          ${buildMoments(moments)}
          ${buildMedia(media)}
        </div>
      </div>
    </div>
  `;

  return article;
}
