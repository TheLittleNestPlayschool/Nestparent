import{
  getStudent,
  getStudentMedia,
  getSignedThumbnails
}from"./parent_data.js";

/*   get local date*/
function getLocalDate(value){
  let timestamp=Number(value);

  if(!timestamp){
    return null;
  }

  if(timestamp<1000000000000){
    timestamp*=1000;
  }

  return new Date(timestamp);
}

/*   is today*/
function isToday(value){
  const date=getLocalDate(value);

  if(!date){
    return false;
  }

  const now=new Date();

  return(
    date.getFullYear()===now.getFullYear() &&
    date.getMonth()===now.getMonth() &&
    date.getDate()===now.getDate()
  );
}

/*   get today media*/
function getTodayMedia(){
  const media=getStudentMedia();
  const thumbnails=getSignedThumbnails();

  return media
    .map((item,index)=>{
      return{
        ...item,
        thumbnail:
          thumbnails[index]||
          ""
      };
    })
    .filter(item=>{
      return(
        !item.is_deleted &&
        isToday(item.created_at)
      );
    });
}

/*   build media item*/
function buildMediaItem(item,index){
  const isVideo=
    item.media_kind==="video";

  return`
    <button
      class="memory-today-item"
      type="button"
      data-memory-media-index="${index}"
      data-memory-media-id="${item.id}"
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
function buildEmptyState(studentName){
  return`
    <div class="memory-today-empty">

      <div class="memory-today-empty-symbol">
        ♡
      </div>

      <div class="memory-today-empty-title">
        Nothing has arrived yet today.
      </div>

      <div class="memory-today-empty-copy">
        When new photos, videos or little moments
        from ${studentName}'s day arrive,
        they'll quietly gather here.
      </div>

    </div>
  `;
}

/*   create today card*/
export function createMemoryTodayCard(){
  const student=getStudent();
  const todayMedia=getTodayMedia();

  const studentName=
    student?.preferred_name||
    student?.name||
    "your little one";

  const count=todayMedia.length;

  const article=
    document.createElement(
      "article"
    );

  article.className=
    "experience memories-experience memory-today-experience";

  article.dataset.type=
    "memory-today";

  article.innerHTML=`
    <div class="memories-stage-card memory-today-stage-card">

      <div class="memory-today-heading">

        <span class="memory-today-kicker">
          Today
        </span>

        <h2 class="memory-today-title">
          ${studentName}'s little moments
        </h2>

        <p class="memory-today-copy">
          ${
            count===0
              ?"A little place for everything that arrives from today."
              :count===1
                ?"One little moment from today."
                :`${count} little moments from today.`
          }
        </p>

      </div>

      ${
        count>0
          ?`
            <div class="memory-today-grid">
              ${
                todayMedia
                  .map(buildMediaItem)
                  .join("")
              }
            </div>
          `
          :buildEmptyState(
            studentName
          )
      }

    </div>
  `;

  article
    .querySelectorAll(
      ".memory-today-item"
    )
    .forEach(button=>{
      button.addEventListener(
        "click",
        event=>{
          event.stopPropagation();

          const index=
            Number(
              button.dataset.memoryMediaIndex
            );

          const media=
            todayMedia[index];

          if(!media){
            return;
          }

          window.dispatchEvent(
            new CustomEvent(
              "parent:memory-media",
              {
                detail:{
                  media
                }
              }
            )
          );
        }
      );
    });

  return article;
}
