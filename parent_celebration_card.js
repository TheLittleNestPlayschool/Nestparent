function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

export function createCelebrationCard(item){
  const detail=item?.detail||{};
  const article=document.createElement("article");
  article.className="experience celebration-detail-experience";
  article.dataset.experienceType="celebration-detail";
  const celebrationId=Number(item?.celebration_id)||0;
  if(celebrationId)article.dataset.celebrationId=String(celebrationId);

  const photo=item?.photo||detail?.media?.[0]||"";
  const birthday=detail?.kind==="birthday";
  const kicker=birthday?"A Birthday Worth Celebrating":"A Special Little Nest Moment";
  const note=detail?.message||item?.deeper||item?.copy||"A special little moment to celebrate together.";

  article.innerHTML=`
    <div class="card celebration-detail-card">
      ${photo?`<div class="celebration-detail-hero" style="background-image:url('${escapeHtml(photo)}')"></div><div class="celebration-detail-hero-shade"></div>`:""}
      <div class="type-mark">CELEBRATION</div>
      <div class="celebration-detail-scroll">
        <header class="celebration-detail-header">
          <div class="celebration-detail-label">Celebration</div>
          <h2>${escapeHtml(detail?.title||item?.title||"A Special Little Nest Celebration")}</h2>
          <p class="celebration-detail-lead">${escapeHtml(detail?.lead||item?.copy||"")}</p>
        </header>
        <div class="celebration-detail-body">
          <section class="celebration-detail-section celebration-detail-message">
            <div class="celebration-detail-kicker">${escapeHtml(kicker)}</div>
            <p>${escapeHtml(note)}</p>
          </section>
          <section class="celebration-detail-section celebration-detail-keepsake">
            <div class="celebration-detail-sparkles" aria-hidden="true">✦ · ✧ · ✦</div>
            <div class="celebration-detail-kicker">A Little Keepsake</div>
            <p>This moment can live on as part of your child's Little Nest story — something special to come back to later.</p>
          </section>
        </div>
      </div>
    </div>
  `;

  return article;
}
