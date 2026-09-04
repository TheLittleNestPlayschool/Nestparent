import{
  getStudent,
  getStudentMedia,
  getSignedThumbnails,
  getSignedMediaUrls,
  getStudentMediaCollections,
  getMediaCollectionTypes
}from"./parent_data.js";

/*   get media date*/
function getMediaDate(value){
  let timestamp=Number(value);
  if(!timestamp)return null;
  if(timestamp<1000000000000)timestamp*=1000;
  return new Date(timestamp);
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
  const now=new Date();
  const start=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const day=start.getDay();
  const daysFromMonday=day===0?6:day-1;
  start.setDate(start.getDate()-daysFromMonday);
  const end=new Date(start);
  end.setDate(end.getDate()+7);
  return date>=start&&date<end;
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
    return{
      title,
      filter:item=>isArchiveMonth(item.created_at,year,month)
    };
  }

  if(collection==="week"){
    return{
      title:"This week's little moments",
      filter:item=>isThisWeek(item.created_at)
    };
  }

  if(collection==="month"){
    return{
      title:`${monthName}'s little moments`,
      filter:item=>isCurrentMonth(item.created_at)
    };
  }

  if(collection==="recognition"){
    const mediaIds=getSpecialCollectionMediaIds("recognition");
    return{
      title:"Recognition Days",
      filter:item=>mediaIds.has(Number(item.id))
    };
  }

  if(collection==="birthday"){
    const mediaIds=getSpecialCollectionMediaIds("birthday");
    return{
      title:"Birthdays",
      filter:item=>mediaIds.has(Number(item.id))
    };
  }

  return{
    title:"Today's little moments",
    filter:item=>isToday(item.created_at)
  };
}

/*   build media item*/
function buildMediaItem(item,index){
  const isVideo=item.media_kind==="video";
  return`
    <button class="memory-today-item" type="button" data-memory-media-index="${index}">
      <span class="memory-today-thumb" style="background-image:url('${item.thumbnail}')"></span>
      ${isVideo?`<span class="memory-today-video">▶</span>`:""}
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
export function createMemoryCollectionCard(collection="today",{onMedia}={}){
  const student=getStudent();
  const definition=getCollectionDefinition(collection);
  const studentName=student?.preferred_name||student?.name||"Your little one";
  const media=getMemoryMedia().filter(item=>definition.filter(item));
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
      <div class="memory-today-heading">
        <h2 class="memory-today-title">${title}</h2>
      </div>
      ${media.length>0
        ?`<div class="memory-today-grid">${media.map(buildMediaItem).join("")}</div>`
        :buildEmptyState(studentName,collection)
      }
    </div>
  `;

  article.querySelectorAll(".memory-today-item").forEach(button=>{
    button.addEventListener("click",event=>{
      event.stopPropagation();
      const index=Number(button.dataset.memoryMediaIndex);
      const selectedMedia=media[index];
      if(!selectedMedia)return;

      const payload={
        media:selectedMedia,
        mediaItems:media,
        index,
        collection
      };

      const handled=typeof onMedia==="function"&&onMedia(payload)===true;
      if(handled)return;

      window.dispatchEvent(new CustomEvent("parent:memory-media",{detail:payload}));
    });
  });

  return article;
}
