import{
  getParentData,
  getStudent,
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

function getTimestamp(value){
  let timestamp=Number(value)||0;
  if(timestamp&&timestamp<1000000000000){timestamp*=1000;}
  return timestamp;
}

function isToday(value){
  const timestamp=getTimestamp(value);
  if(!timestamp){return false;}
  const date=new Date(timestamp);
  const now=new Date();
  return date.getFullYear()===now.getFullYear()&&date.getMonth()===now.getMonth()&&date.getDate()===now.getDate();
}

function getTodayMedia(){
  const media=getStudentMedia()||[];
  const thumbnails=getSignedThumbnails()||[];
  return media
    .map((item,index)=>({...item,thumbnail:thumbnails[index]||""}))
    .filter(item=>!item?.is_deleted&&item.thumbnail&&isToday(item?.created_at))
    .sort((a,b)=>getTimestamp(b?.created_at)-getTimestamp(a?.created_at));
}

function getTeacherMoments(){
  const parentData=getParentData()||{};
  const source=[parentData?.student_moments,parentData?.student_moment].find(Array.isArray)||[];
  return source
    .filter(item=>item?.is_active!==false)
    .map(item=>String(item?.moment||item?.parent_note||"").trim())
    .filter(Boolean)
    .slice(0,4);
}

function buildTeacherMoments(moments){
  if(!moments.length){return"";}
  return`
    <section class="moments-detail-section">
      <div class="moments-detail-kicker">Little Things Worth Remembering</div>
      <div class="moments-detail-notes">
        ${moments.map(moment=>`<div>${escapeHtml(moment)}</div>`).join("")}
      </div>
    </section>
  `;
}

function buildMedia(media){
  if(!media.length){
    return`
      <section class="moments-detail-section moments-detail-empty">
        <div class="moments-detail-kicker">Today's Little Moments</div>
        <p>Nothing has arrived yet today. When photos, videos or little moments arrive, they'll gather here.</p>
      </section>
    `;
  }
  return`
    <section class="moments-detail-section">
      <div class="moments-detail-kicker">Today's Little Moments</div>
      <div class="moments-detail-grid">
        ${media.slice(0,8).map((item,index)=>`
          <button class="moments-detail-media${index===0?" is-primary":""}" type="button" data-moment-media-index="${index}">
            <span style="background-image:url('${escapeHtml(item.thumbnail)}')"></span>
            ${item.media_kind==="video"?`<b>▶</b>`:""}
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

/*   create expanded moments card*/
export function createMomentsCard(item){
  const student=getStudent();
  const studentName=student?.preferred_name||student?.name||"Your little one";
  const media=getTodayMedia();
  const teacherMoments=getTeacherMoments();
  const count=media.length;
  const article=document.createElement("article");
  article.className="experience moments-detail-experience";
  article.dataset.experienceType="moments-detail";

  article.innerHTML=`
    <div class="card moments-detail-card">
      <div class="type-mark">MOMENTS</div>
      <div class="moments-detail-scroll">
        <header class="moments-detail-header">
          <div class="moments-detail-label">Moments</div>
          <h2>${escapeHtml(studentName)}'s Little Moments</h2>
          <p class="moments-detail-lead">${count?`${count} little ${count===1?"moment":"moments"} from today — the small parts of the day you might otherwise have missed.`:"The small parts of the day you might otherwise have missed will gather here."}</p>
        </header>
        <div class="moments-detail-body">
          ${buildTeacherMoments(teacherMoments)}
          ${buildMedia(media)}
        </div>
      </div>
    </div>
  `;

  article.querySelectorAll("[data-moment-media-index]").forEach(button=>{
    button.addEventListener("click",event=>{
      event.stopPropagation();
      const selected=media[Number(button.dataset.momentMediaIndex)];
      if(!selected){return;}
      window.dispatchEvent(new CustomEvent("parent:memory-media",{detail:{media:selected}}));
    });
  });

  return article;
}
