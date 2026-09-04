import{
  getStudent,
  getStudentMedia
}from"./parent_data.js";

/*   get media date*/
function getMediaDate(value){
  let timestamp=Number(value);

  if(!timestamp){
    return null;
  }

  if(timestamp<1000000000000){
    timestamp*=1000;
  }

  const date=new Date(timestamp);

  if(Number.isNaN(date.getTime())){
    return null;
  }

  return date;
}

/*   build archive groups*/
function getArchiveGroups(){
  const media=getStudentMedia();
  const now=new Date();
  const currentMonthStart=new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );
  const groups=new Map();

  media
    .filter(item=>!item.is_deleted)
    .forEach(item=>{
      const date=getMediaDate(
        item.created_at
      );

      if(
        !date||
        date>=currentMonthStart
      ){
        return;
      }

      const year=date.getFullYear();
      const month=date.getMonth();
      const key=`${year}-${String(month+1).padStart(2,"0")}`;

      if(!groups.has(key)){
        groups.set(
          key,
          {
            id:key,
            year,
            month,
            title:new Intl.DateTimeFormat(
              "en",
              {
                month:"long",
                year:"numeric"
              }
            ).format(date),
            count:0
          }
        );
      }

      groups.get(key).count+=1;
    });

  return[
    ...groups.values()
  ]
    .filter(group=>group.count>0)
    .sort(
      (a,b)=>
        b.year-a.year||
        b.month-a.month
    );
}

/*   create archive card*/
export function createMemoryArchiveCard(){
  const student=getStudent();
  const studentName=
    student?.preferred_name||
    student?.name||
    "Your little one";
  const archiveGroups=getArchiveGroups();
  const article=document.createElement(
    "article"
  );

  article.className=
    "experience memory-archive-experience";
  article.dataset.type=
    "memory-archive";

  article.innerHTML=`
    <div class="memory-archive-card">
      <div class="memory-archive-heading">
        <span class="memory-archive-kicker">
          ${studentName}'s Story So Far
        </span>

        <h2 class="memory-archive-title">
          Wander a little further back.
        </h2>

        <p class="memory-archive-copy">
          ${studentName}'s earlier Little Nest moments are waiting here whenever you want to return to them.
        </p>
      </div>

      <div class="memory-archive-list">
        ${
          archiveGroups
            .map(group=>`
              <button
                class="memory-archive-item"
                type="button"
                data-memory-archive="${group.id}"
                data-memory-year="${group.year}"
                data-memory-month="${group.month}"
              >
                <span class="memory-archive-item-title">
                  ${group.title}
                </span>

                <span class="memory-archive-item-copy">
                  ${studentName}'s ${new Intl.DateTimeFormat("en",{month:"long"}).format(new Date(group.year,group.month,1))} memories
                </span>

                <span class="memory-archive-item-count">
                  ${group.count}
                  ${group.count===1?"moment":"moments"}
                </span>
              </button>
            `)
            .join("")
        }
      </div>
    </div>
  `;

  article
    .querySelectorAll(
      ".memory-archive-item"
    )
    .forEach(button=>{
      button.addEventListener(
        "click",
        event=>{
          event.stopPropagation();

          const archive=
            button.dataset.memoryArchive;
          const year=Number(
            button.dataset.memoryYear
          );
          const month=Number(
            button.dataset.memoryMonth
          );

          window.dispatchEvent(
            new CustomEvent(
              "parent:memory-archive",
              {
                detail:{
                  archive,
                  year,
                  month
                }
              }
            )
          );
        }
      );
    });

  return article;
}
