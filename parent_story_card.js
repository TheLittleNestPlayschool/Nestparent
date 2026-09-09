import{
  getStudentMedia,
  getSignedThumbnails
}from"./parent_data.js";

/*   escape html*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/*   story media ids*/
function getStoryMediaIds(){
  const media=getStudentMedia();
  const thumbnails=getSignedThumbnails();
  const ids=new Map();
  media.forEach((item,index)=>{
    const url=thumbnails[index]||"";
    const id=Number(item?.id)||0;
    if(url&&id&&!ids.has(url)){ids.set(url,id);}
  });
  return ids;
}

/*   story media*/
function buildMedia(media){
  if(!media.length){return"";}
  const mediaIds=getStoryMediaIds();
  return`
    <section class="story-detail-section story-detail-media-section">
      <div class="story-detail-media">
        ${media.slice(0,4).map((url,index)=>{
          const mediaId=mediaIds.get(url)||0;
          return`<div class="story-detail-photo${index===0?" is-primary":""}"${mediaId?` data-media-id="${mediaId}"`:""} style="background-image:url('${escapeHtml(url)}')"></div>`;
        }).join("")}
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
  const hero=item?.photo||detail.media?.[0]||"";
  const media=Array.isArray(detail.media)?detail.media:[];

  article.innerHTML=`
    <div class="card story-detail-card">
      <div class="story-detail-hero" style="background-image:url('${escapeHtml(hero)}')"></div>
      <div class="story-detail-hero-shade"></div>
      <div class="type-mark">Story</div>
      <div class="story-detail-scroll">
        <header class="story-detail-header">
          <h2>${escapeHtml(title)}</h2>
          <p class="story-detail-lead">${escapeHtml(lead)}</p>
        </header>
        <div class="story-detail-body">
          ${buildMedia(media)}
        </div>
      </div>
    </div>
  `;

  return article;
}
