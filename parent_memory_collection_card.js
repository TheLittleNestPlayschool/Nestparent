import{
  getStudent,
  getStudentMedia,
  getSignedThumbnails,
  getSignedMediaUrls,
  getStudentMediaCollections,
  getMediaCollectionTypes
}from"./parent_data.js";
import{downloadMemoryMedia}from"./parent_memory_download.js";

/*   get media date*/
function getMediaDate(value){
  let timestamp=Number(value);
  if(!timestamp)return null;
  if(timestamp<1000000000000)timestamp*=1000;
  return new Date(timestamp);
}

/*   get week start*/
function getWeekStart(offsetWeeks=0){
  const now=new Date();
  const start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const day=start.getDay();
  const daysFromMonday=day===0?6:day-1;
  start.setDate(start.getDate()-daysFromMonday+(offsetWeeks*7));
  return start;
}

/*   is today*/
function isToday(value){
  const date=getMediaDate(value);
  if(!date)return false;
  const now=new Date();
  return date.getFullYear()===now.getFullYear()&&date.getMonth()===now.getMonth()&&date.getDate()===now.getDate();
}

/*   is this week*/
function isThisWeek(value){
  const date=getMediaDate(value);
  if(!date)return false;
  const start=getWeekStart();
  const end=new Date(start);
  end.setDate(end.getDate()+7);
  return date>=start&&date<end;
}

/*   is last week*/
function isLastWeek(value){
  const date=getMediaDate(value);
  if(!date)return false;
  return date>=getWeekStart(-1)&&date<getWeekStart();
}

/*   is current month*/
function isCurrentMonth(value){
  const date=getMediaDate(value);
  if(!date)return false;
  const now=new Date();
  return date.getFullYear()===now.getFullYear()&&date.getMonth()===now.getMonth();
}

/*   is archive month*/
function isArchiveMonth(value,year,month){
  const date=getMediaDate(value);
  if(!date)return false;
  return date.getFullYear()===year&&date.getMonth()===month;
}

/*   get memory media*/
function getMemoryMedia(){
  const media=getStudentMedia();
  const thumbnails=getSignedThumbnails();
  const mediaUrls=getSignedMediaUrls();
  return media.map((item,index)=>({
    ...item,
    thumbnail:thumbnails[index]||"",
    media_url:mediaUrls[index]||""
  })).filter(item=>!item.is_deleted);
}

/*   get special collection media ids*/
function getSpecialCollectionMediaIds(collectionCode){
  const collectionTypes=getMediaCollectionTypes();
  const collectionLinks=getStudentMediaCollections();
  const collectionType=collectionTypes.find(type=>type.is_active&&String(type.code||"").trim().toLowerCase()===collectionCode);
  if(!collectionType)return new Set();
  return new Set(
    collectionLinks
      .filter(link=>Number(link.media_collection_type_id)===Number(collectionType.id))
      .map(link=>Number(link.student_media_id))
  );
}

/*   get collection definition*/
function getCollectionDefinition(collection){
  const monthName=new Intl.DateTimeFormat("en",{month:"long"}).format(new Date());

  if(collection&&typeof collection==="object"&&collection.type==="archive-month"){
    const year=Number(collection.year);
    const month=Number(collection.month);
    const title=new Intl.DateTimeFormat("en",{month:"long",year:"numeric"}).format(new Date(year,month,1));
    return{title,filter:item=>isArchiveMonth(item.created_at,year,month)};
  }

  if(collection==="week")return{title:"This week's little moments",filter:item=>isThisWeek(item.created_at)};
  if(collection==="lastweek")return{title:"Last week's little moments",filter:item=>isLastWeek(item.created_at)};
  if(collection==="month")return{title:`${monthName}'s little moments`,filter:item=>isCurrentMonth(item.created_at)};

  if(collection==="recognition"){
    const mediaIds=getSpecialCollectionMediaIds("recognition");
    return{title:"Recognition Days",filter:item=>mediaIds.has(Number(item.id))};
  }

  if(collection==="birthday"){
    const mediaIds=getSpecialCollectionMediaIds("birthday");
    return{title:"Birthdays",filter:item=>mediaIds.has(Number(item.id))};
  }

  return{title:"Today's little moments",filter:item=>isToday(item.created_at)};
}

/*   stable collection key*/
function getCollectionKey(collection){
  if(collection&&typeof collection==="object")return`${collection.type||"collection"}-${collection.year||""}-${collection.month||""}`;
  return String(collection||"today");
}

/*   stable layout seed*/
function getLayoutSeed(collection,media){
  const source=`${getCollectionKey(collection)}-${media.map(item=>item.id).join("-")}`;
  let hash=0;
  for(let i=0;i<source.length;i++)hash=((hash<<5)-hash+source.charCodeAt(i))|0;
  return Math.abs(hash);
}

/*   arrange media for collection*/
function arrangeMedia(collection,media){
  if(media.length<2)return media;
  const offset=getLayoutSeed(collection,media)%media.length;
  return[...media.slice(offset),...media.slice(0,offset)];
}

/*   build media item*/
function buildMediaItem(item,index){
  const isVideo=item.media_kind==="video";
  return`
    <button class="memory-today-item" type="button" data-memory-media-index="${index}" aria-pressed="false">
      <span class="memory-today-thumb" style="background-image:url('${item.thumbnail}')"></span>
      ${isVideo?`<span class="memory-today-video" role="button" aria-label="Play video">▶</span>`:""}
      <span class="memory-today-selected" aria-hidden="true">✓</span>
    </button>
  `;
}

/*   build empty state*/
function buildEmptyState(studentName,collection){
  const isTodayCollection=collection==="today";
  const title=isTodayCollection?"Today's moments are coming soon!":"Little moments are coming soon!";
  const copy=isTodayCollection
    ?"As today's little moments arrive, they'll gather here for you."
    :`As ${studentName}'s little moments arrive, they'll gather here for you.`;

  return`
    <div class="memory-today-empty">
      <div class="memory-today-empty-visual" aria-hidden="true">
        <span class="memory-today-empty-card empty-card-one"></span>
        <span class="memory-today-empty-card empty-card-two"></span>
        <span class="memory-today-empty-card empty-card-three"></span>
        <span class="memory-today-empty-heart">♡</span>
        <span class="memory-today-empty-spark empty-spark-one">✦</span>
        <span class="memory-today-empty-spark empty-spark-two">✦</span>
        <span class="memory-today-empty-spark empty-spark-three">✦</span>
      </div>
      <div class="memory-today-empty-title">${title}</div>
      <div class="memory-today-empty-copy">${copy}</div>
    </div>
  `;
}

/*   create memory collection card*/
export function createMemoryCollectionCard(collection="today"){
  const student=getStudent();
  const definition=getCollectionDefinition(collection);
  const studentName=student?.preferred_name||student?.name||"Your little one";
  const media=getMemoryMedia().filter(item=>definition.filter(item));
  const displayMedia=arrangeMedia(collection,media);
  const layout=(getLayoutSeed(collection,media)%6)+1;
  const article=document.createElement("article");
  const isArchiveMonth=collection&&typeof collection==="object"&&collection.type==="archive-month";
  const collectionType=isArchiveMonth?"archive-month":collection;

  article.className="experience memories-experience memory-today-experience";
  article.dataset.type=`memory-${collectionType}`;

  const title=isArchiveMonth
    ?definition.title
    :collection==="today"
      ?`${studentName}'s little moments`
      :collection==="recognition"
        ?`${studentName}'s Recognition Days`
        :collection==="birthday"
          ?`${studentName}'s Birthdays`
          :definition.title;

  article.innerHTML=`
    <div class="memories-stage-card memory-today-stage-card">
      <div class="memory-today-heading"><h2 class="memory-today-title">${title}</h2></div>
      ${displayMedia.length>0
        ?`<div class="memory-today-grid" data-layout="${layout}">${displayMedia.map(buildMediaItem).join("")}</div>
          <div class="memory-today-actions" hidden>
            <span class="memory-today-selection-count"></span>
            <button class="memory-today-action memory-today-download" type="button">
              <span class="memory-today-action-symbol">↓</span>
              <span class="memory-viewer-download-label">Download</span>
            </button>
            <button class="memory-today-action memory-today-share" type="button">
              <span class="memory-today-action-symbol">↗</span>
              <span>Share</span>
            </button>
          </div>`
        :buildEmptyState(studentName,collection)
      }
    </div>
  `;

  const selectedIndexes=new Set();
  const actionBar=article.querySelector(".memory-today-actions");
  const selectionCount=article.querySelector(".memory-today-selection-count");
  const download=article.querySelector(".memory-today-download");
  const downloadLabel=download?.querySelector(".memory-viewer-download-label");
  const share=article.querySelector(".memory-today-share");
  const buttons=[...article.querySelectorAll(".memory-today-item")];

  /*   update selection*/
  function updateSelection(){
    buttons.forEach((button,index)=>{
      const selected=selectedIndexes.has(index);
      button.classList.toggle("is-selected",selected);
      button.setAttribute("aria-pressed",selected?"true":"false");
    });

    const count=selectedIndexes.size;
    if(actionBar){
      actionBar.hidden=count===0;
      actionBar.classList.toggle("is-visible",count>0);
    }
    if(selectionCount)selectionCount.textContent=count===1?"1 selected":`${count} selected`;
    if(downloadLabel)downloadLabel.textContent=count>1?`Download ${count}`:"Download";

    const singleIndex=count===1?[...selectedIndexes][0]:-1;
    const singleMedia=singleIndex>=0?displayMedia[singleIndex]:null;
    if(share)share.hidden=count!==1||singleMedia?.sharable!==true;
  }

  /*   toggle selection*/
  function toggleSelection(index){
    if(!displayMedia[index])return;
    if(selectedIndexes.has(index))selectedIndexes.delete(index);
    else selectedIndexes.add(index);
    updateSelection();
  }

  /*   play video in collage*/
  function playVideo(button,index){
    const item=displayMedia[index];
    if(!item||item.media_kind!=="video"||!item.media_url)return;

    article.querySelectorAll(".memory-today-inline-video").forEach(video=>{
      if(video.parentElement!==button)video.remove();
    });

    const existing=button.querySelector(".memory-today-inline-video");
    if(existing){
      existing.play().catch(()=>{});
      return;
    }

    const video=document.createElement("video");
    video.className="memory-today-inline-video";
    video.src=item.media_url;
    video.controls=true;
    video.autoplay=true;
    video.playsInline=true;
    video.preload="metadata";
    button.appendChild(video);
    video.play().catch(()=>{});
  }

  buttons.forEach(button=>{
    button.addEventListener("click",event=>{
      event.stopPropagation();
      const index=Number(button.dataset.memoryMediaIndex);
      if(event.target.closest(".memory-today-video")){
        playVideo(button,index);
        return;
      }
      if(event.target.closest(".memory-today-inline-video"))return;
      toggleSelection(index);
    });
  });

  /*   download selected memories*/
  download?.addEventListener("click",async event=>{
    event.stopPropagation();
    const indexes=[...selectedIndexes].sort((a,b)=>a-b);
    if(!indexes.length)return;

    for(let i=0;i<indexes.length;i++){
      if(downloadLabel)downloadLabel.textContent=indexes.length>1?`Saving ${i+1} of ${indexes.length}`:"Saving...";
      await downloadMemoryMedia(displayMedia[indexes[i]],download);
    }

    selectedIndexes.clear();
    updateSelection();
  });

  /*   share selected memory*/
  share?.addEventListener("click",event=>{
    event.stopPropagation();
    if(selectedIndexes.size!==1)return;
    const selectedIndex=[...selectedIndexes][0];
    const selectedMedia=displayMedia[selectedIndex];
    if(!selectedMedia||selectedMedia.sharable!==true)return;

    window.dispatchEvent(new CustomEvent("parent:share-memory",{
      detail:{media:selectedMedia,index:selectedIndex,mediaItems:displayMedia,collection}
    }));
  });

  return article;
}
