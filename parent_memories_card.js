import{
  memoryChapters
}from"./parent_memories_data.js";

import{
  getStudent,
  getStudentMedia,
  getSignedThumbnails,
  getStudentMediaCollections,
  getMediaCollectionTypes
}from"./parent_data.js";

/*   special collection presentation*/
const specialCollectionPresentation={
  recognition:{
    title:"Recognition Days",
    symbol:"✦"
  },
  birthday:{
    title:"Birthdays",
    symbol:"♡"
  }
};

/*   get media with thumbnails*/
function getMemoryMedia(){
  const media=getStudentMedia();
  const thumbnails=getSignedThumbnails();

  return media
    .map((item,index)=>{
      return{
        ...item,
        thumbnail:thumbnails[index]||""
      };
    })
    .filter(item=>!item.is_deleted);
}

/*   get media date*/
function getMediaDate(value){
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
  const date=getMediaDate(value);

  if(!date){
    return false;
  }

  const now=new Date();

  return(
    date.getFullYear()===now.getFullYear()&&
    date.getMonth()===now.getMonth()&&
    date.getDate()===now.getDate()
  );
}

/*   is this week*/
function isThisWeek(value){
  const date=getMediaDate(value);

  if(!date){
    return false;
  }

  const now=new Date();

  const start=new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const day=start.getDay();

  const daysFromMonday=
    day===0
      ?6
      :day-1;

  start.setDate(
    start.getDate()-
    daysFromMonday
  );

  const end=new Date(start);

  end.setDate(
    end.getDate()+7
  );

  return(
    date>=start&&
    date<end
  );
}

/*   is current month*/
function isCurrentMonth(value){
  const date=getMediaDate(value);

  if(!date){
    return false;
  }

  const now=new Date();

  return(
    date.getFullYear()===now.getFullYear()&&
    date.getMonth()===now.getMonth()
  );
}

/*   get pronoun label*/
function getStoryLabel(student){
  const gender=String(
    student?.gender||""
  )
    .trim()
    .toLowerCase();

  if(gender==="male"){
    return"His Little Story";
  }

  if(gender==="female"){
    return"Her Little Story";
  }

  return"Their Little Story";
}

/*   get current month*/
function getCurrentMonth(){
  return new Intl.DateTimeFormat(
    "en",
    {
      month:"long"
    }
  ).format(
    new Date()
  );
}

/*   get live memories*/
function getLiveMemories(){
  const student=getStudent();
  const media=getMemoryMedia();

  const studentName=
    student?.preferred_name||
    student?.name||
    "Your little one";

  const todayCount=
    media.filter(
      item=>
        isToday(
          item.created_at
        )
    ).length;

  const weekCount=
    media.filter(
      item=>
        isThisWeek(
          item.created_at
        )
    ).length;

  const monthCount=
    media.filter(
      item=>
        isCurrentMonth(
          item.created_at
        )
    ).length;

  const newestMedia=
    [...media]
      .sort(
        (a,b)=>
          Number(b.created_at)-
          Number(a.created_at)
      )
      .find(
        item=>
          item.thumbnail
      );

  const fallbackPhoto=
    "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1200&q=86";

  return{
    studentName,
    label:getStoryLabel(student),
    title:`${studentName}'s Memories`,
    count:media.length,
    copy:
      media.length>0
        ?`The little moments from ${studentName}'s Little Nest story, quietly gathered together.`
        :`A place for ${studentName}'s Little Nest moments as they begin to arrive.`,
    photo:
      newestMedia?.thumbnail||
      fallbackPhoto,
    todayCount,
    weekCount,
    monthCount,
    monthName:getCurrentMonth()
  };
}

/*   build live chapters*/
function getLiveChapters(){
  const live=getLiveMemories();

  return memoryChapters.map(
    chapter=>{

      if(chapter.id==="today"){
        return{
          ...chapter,
          title:"Today",
          copy:
            live.todayCount===0
              ?"No new moments yet"
              :live.todayCount===1
                ?"1 new little moment"
                :`${live.todayCount} new little moments`,
          count:live.todayCount
        };
      }

      if(chapter.id==="week"){
        return{
          ...chapter,
          title:"This Week",
          copy:
            live.weekCount===0
              ?"No moments yet this week"
              :"A little look at this week",
          count:live.weekCount
        };
      }

      if(chapter.id==="august"){
        return{
          ...chapter,
          title:live.monthName,
          copy:
            live.monthCount===0
              ?`No ${live.monthName} moments yet`
              :`${live.studentName}'s ${live.monthName} memories`,
          count:live.monthCount
        };
      }

      return chapter;
    }
  );
}

/*   get live special collections*/
function getLiveMemoryCollections(){
  const media=getMemoryMedia();
  const collectionLinks=
    getStudentMediaCollections();

  const collectionTypes=
    getMediaCollectionTypes();

  const validMediaIds=
    new Set(
      media.map(
        item=>
          Number(item.id)
      )
    );

  return collectionTypes
    .filter(
      type=>
        type.is_active
    )
    .map(
      type=>{
        const code=
          String(
            type.code||""
          )
            .trim()
            .toLowerCase();

        const matchingMediaIds=
          new Set(
            collectionLinks
              .filter(
                link=>
                  Number(
                    link.media_collection_type_id
                  )===
                  Number(
                    type.id
                  )
                  &&
                  validMediaIds.has(
                    Number(
                      link.student_media_id
                    )
                  )
              )
              .map(
                link=>
                  Number(
                    link.student_media_id
                  )
              )
          );

        if(
          matchingMediaIds.size===
          0
        ){
          return null;
        }

        const presentation=
          specialCollectionPresentation[
            code
          ]||{};

        return{
          id:code||String(type.id),
          typeId:type.id,
          code,
          title:
            presentation.title||
            type.name,
          symbol:
            presentation.symbol||
            "✦",
          count:
            matchingMediaIds.size
        };
      }
    )
    .filter(Boolean);
}

/*   build special collections*/
function buildMemoryCollections(){
  const collections=
    getLiveMemoryCollections();

  if(collections.length===0){
    return"";
  }

  return`
    <div class="memory-specials">
      ${
        collections
          .map(
            collection=>`
              <button
                class="memory-special"
                type="button"
                data-memory-collection="${collection.id}"
              >
                <span class="memory-special-symbol">
                  ${collection.symbol}
                </span>

                <span class="memory-special-title">
                  ${collection.title}
                </span>
              </button>
            `
          )
          .join("")
      }
    </div>
  `;
}

/*   create memories card*/
export function createMemoriesCard({
  onChapter
}={}){
  const article=
    document.createElement(
      "article"
    );

  const memories=
    getLiveMemories();

  const chapters=
    getLiveChapters();

  article.className=
    "experience memories-experience";

  article.dataset.type=
    "memories";

  article.innerHTML=`
    <div class="memories-stage-card">

      <div class="memories-hero">

        <div
          class="memories-photo"
          style="
            background-image:
            url('${memories.photo}')
          "
        ></div>

        <div class="memories-photo-shade"></div>

        <div class="memories-heading">

          <span class="memories-kicker">
            ${memories.label}
          </span>

          <h2 class="memories-title">
            ${memories.title}
          </h2>

          <p class="memories-copy">
            ${memories.copy}
          </p>

          <div class="memories-count">
            ${memories.count}
            ${
              memories.count===1
                ?"little moment saved"
                :"little moments saved"
            }
          </div>

          ${buildMemoryCollections()}

        </div>

      </div>

      <div class="memory-chapters">
        ${
          chapters
            .map(
              chapter=>`
                <button
                  class="memory-chapter"
                  type="button"
                  data-memory-chapter="${chapter.id}"
                >
                  <span class="memory-chapter-title">
                    ${chapter.title}
                  </span>

                  <span class="memory-chapter-copy">
                    ${chapter.copy}
                  </span>

                  <span class="memory-chapter-count">
                    ${chapter.count}
                  </span>
                </button>
              `
            )
            .join("")
        }
      </div>

    </div>
  `;

  article
    .querySelectorAll(
      ".memory-chapter"
    )
    .forEach(
      button=>{
        button.addEventListener(
          "click",
          event=>{
            event.stopPropagation();

            const chapter=
              button.dataset.memoryChapter;

            const handled=
              typeof onChapter===
                "function"
              &&
              onChapter(
                chapter
              )===true;

            if(handled){
              return;
            }

            window.dispatchEvent(
              new CustomEvent(
                "parent:memory-chapter",
                {
                  detail:{
                    chapter
                  }
                }
              )
            );
          }
        );
      }
    );

  article
    .querySelectorAll(
      ".memory-special"
    )
    .forEach(
      button=>{
        button.addEventListener(
          "click",
          event=>{
            event.stopPropagation();

            const collection=
              button.dataset.memoryCollection;

            window.dispatchEvent(
              new CustomEvent(
                "parent:memory-collection",
                {
                  detail:{
                    collection
                  }
                }
              )
            );
          }
        );
      }
    );

  return article;
}
