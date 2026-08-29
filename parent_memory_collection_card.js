import{
  getStudent,
  getStudentMedia,
  getSignedThumbnails,
  getSignedMediaUrls
}from"./parent_data.js";

/*   get media date*/
function getMediaDate(value){
  let timestamp=
    Number(value);

  if(!timestamp){
    return null;
  }

  if(
    timestamp<
    1000000000000
  ){
    timestamp*=1000;
  }

  return new Date(
    timestamp
  );
}

/*   is today*/
function isToday(value){
  const date=
    getMediaDate(value);

  if(!date){
    return false;
  }

  const now=
    new Date();

  return(
    date.getFullYear()===
      now.getFullYear()
    &&
    date.getMonth()===
      now.getMonth()
    &&
    date.getDate()===
      now.getDate()
  );
}

/*   is this week*/
function isThisWeek(value){
  const date=
    getMediaDate(value);

  if(!date){
    return false;
  }

  const now=
    new Date();

  const start=
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

  const day=
    start.getDay();

  const daysFromMonday=
    day===0
      ?6
      :day-1;

  start.setDate(
    start.getDate()-
    daysFromMonday
  );

  const end=
    new Date(
      start
    );

  end.setDate(
    end.getDate()+7
  );

  return(
    date>=start
    &&
    date<end
  );
}

/*   is current month*/
function isCurrentMonth(value){
  const date=
    getMediaDate(value);

  if(!date){
    return false;
  }

  const now=
    new Date();

  return(
    date.getFullYear()===
      now.getFullYear()
    &&
    date.getMonth()===
      now.getMonth()
  );
}

/*   get memory media*/
function getMemoryMedia(){
  const media=
    getStudentMedia();

  const thumbnails=
    getSignedThumbnails();

  const mediaUrls=
    getSignedMediaUrls();

  return media
    .map(
      (
        item,
        index
      )=>{
        return{
          ...item,

          thumbnail:
            thumbnails[index]||
            "",

          media_url:
            mediaUrls[index]||
            ""
        };
      }
    )
    .filter(
      item=>
        !item.is_deleted
    );
}

/*   get collection definition*/
function getCollectionDefinition(
  collection
){
  const monthName=
    new Intl.DateTimeFormat(
      "en",
      {
        month:"long"
      }
    ).format(
      new Date()
    );

  if(
    collection===
    "week"
  ){
    return{
      kicker:
        "This Week",

      title:
        "This week's little moments",

      filter:
        isThisWeek
    };
  }

  if(
    collection===
    "month"
  ){
    return{
      kicker:
        monthName,

      title:
        `${monthName}'s little moments`,

      filter:
        isCurrentMonth
    };
  }

  return{
    kicker:
      "Today",

    title:
      "Today's little moments",

    filter:
      isToday
  };
}

/*   build media item*/
function buildMediaItem(
  item,
  index
){
  const isVideo=
    item.media_kind===
    "video";

  return`
    <button
      class="memory-today-item"
      type="button"
      data-memory-media-index="${index}"
    >

      <span
        class="memory-today-thumb"
        style="
          background-image:
          url('${item.thumbnail}')
        "
      ></span>

      ${
        isVideo
          ?`
            <span class="memory-today-video">
              ▶
            </span>
          `
          :""
      }

    </button>
  `;
}

/*   build empty state*/
function buildEmptyState(
  studentName,
  kicker
){
  return`
    <div class="memory-today-empty">

      <div class="memory-today-empty-symbol">
        ♡
      </div>

      <div class="memory-today-empty-title">
        No moments here yet.
      </div>

      <div class="memory-today-empty-copy">
        ${studentName}'s ${kicker.toLowerCase()}
        moments will quietly gather here
        as they arrive.
      </div>

    </div>
  `;
}

/*   create memory collection card*/
export function createMemoryCollectionCard(
  collection="today",
  {
    onMedia
  }={}
){
  const student=
    getStudent();

  const definition=
    getCollectionDefinition(
      collection
    );

  const studentName=
    student?.preferred_name||
    student?.name||
    "Your little one";

  const media=
    getMemoryMedia()
      .filter(
        item=>
          definition.filter(
            item.created_at
          )
      );

  const article=
    document.createElement(
      "article"
    );

  article.className=
    "experience memories-experience memory-today-experience";

  article.dataset.type=
    `memory-${collection}`;

  article.innerHTML=`
    <div class="memories-stage-card memory-today-stage-card">

      <div class="memory-today-heading">

        <span class="memory-today-kicker">
          ${definition.kicker}
        </span>

        <h2 class="memory-today-title">
          ${
            collection==="today"
              ?`${studentName}'s little moments`
              :definition.title
          }
        </h2>

        <p class="memory-today-copy">
          ${
            media.length===0
              ?`A little place for ${studentName}'s moments.`
              :media.length===1
                ?"One little moment waiting here."
                :`${media.length} little moments waiting here.`
          }
        </p>

      </div>

      ${
        media.length>0
          ?`
            <div class="memory-today-grid">
              ${
                media
                  .map(
                    buildMediaItem
                  )
                  .join("")
              }
            </div>
          `
          :buildEmptyState(
            studentName,
            definition.kicker
          )
      }

    </div>
  `;

  article
    .querySelectorAll(
      ".memory-today-item"
    )
    .forEach(
      button=>{

        button.addEventListener(
          "click",
          event=>{

            event.stopPropagation();

            const index=
              Number(
                button
                  .dataset
                  .memoryMediaIndex
              );

            const selectedMedia=
              media[index];

            if(
              !selectedMedia
            ){
              return;
            }

            const payload={
              media:
                selectedMedia,

              mediaItems:
                media,

              index,

              collection
            };

            const handled=
              typeof onMedia===
                "function"
              &&
              onMedia(
                payload
              )===true;

            if(handled){
              return;
            }

            window.dispatchEvent(
              new CustomEvent(
                "parent:memory-media",
                {
                  detail:
                    payload
                }
              )
            );
          }
        );
      }
    );

  return article;
}
