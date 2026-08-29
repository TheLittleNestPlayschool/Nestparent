import{
  renderViewerMedia
}from"./parent_memory_viewer_media.js";

import{
  downloadMemoryMedia
}from"./parent_memory_download.js";

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

/*   format media date*/
function formatMediaDate(value){
  const date=
    getMediaDate(value);

  if(!date){
    return"";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      month:"long",
      day:"numeric",
      year:"numeric"
    }
  ).format(
    date
  );
}

/*   get collection label*/
function getCollectionLabel(
  collection
){
  if(
    collection===
    "week"
  ){
    return"This Week";
  }

  if(
    collection===
    "month"
  ){
    return new Intl.DateTimeFormat(
      "en",
      {
        month:"long"
      }
    ).format(
      new Date()
    );
  }

  return"Today";
}

/*   create memory viewer card*/
export function createMemoryViewerCard({
  mediaItems=[],
  activeIndex=0,
  collection="today"
}={}){
  const article=
    document.createElement(
      "article"
    );

  article.className=
    "experience memories-experience memory-viewer-experience";

  article.dataset.type=
    "memory-viewer";

  let currentIndex=
    Math.min(
      Math.max(
        0,
        activeIndex
      ),
      Math.max(
        0,
        mediaItems.length-1
      )
    );

  article.innerHTML=`
    <div class="memory-viewer-stage-card">

      <div class="memory-viewer-media"></div>

      <div class="memory-viewer-top">

        <span class="memory-viewer-kicker">
          ${getCollectionLabel(collection)}
        </span>

        <span class="memory-viewer-counter"></span>

      </div>

      <button
        class="memory-viewer-nav memory-viewer-prev"
        type="button"
        aria-label="Previous memory"
      >
        ‹
      </button>

      <button
        class="memory-viewer-nav memory-viewer-next"
        type="button"
        aria-label="Next memory"
      >
        ›
      </button>

      <div class="memory-viewer-bottom">

        <div class="memory-viewer-detail">

          <span class="memory-viewer-date"></span>

          <span class="memory-viewer-kind"></span>

        </div>

        <div class="memory-viewer-actions">

          <button
            class="memory-viewer-download"
            type="button"
          >
            <span class="memory-viewer-download-symbol">
              ↓
            </span>

            <span class="memory-viewer-download-label">
              Download
            </span>
          </button>

          <button
            class="memory-viewer-share"
            type="button"
          >
            <span class="memory-viewer-share-symbol">
              ↗
            </span>

            <span>
              Share
            </span>
          </button>

        </div>

      </div>

    </div>
  `;

  const mediaContainer=
    article.querySelector(
      ".memory-viewer-media"
    );

  const counter=
    article.querySelector(
      ".memory-viewer-counter"
    );

  const date=
    article.querySelector(
      ".memory-viewer-date"
    );

  const kind=
    article.querySelector(
      ".memory-viewer-kind"
    );

  const previous=
    article.querySelector(
      ".memory-viewer-prev"
    );

  const next=
    article.querySelector(
      ".memory-viewer-next"
    );

  const download=
    article.querySelector(
      ".memory-viewer-download"
    );

  const share=
    article.querySelector(
      ".memory-viewer-share"
    );

  /*   render current memory*/
  function renderCurrent(){
    const item=
      mediaItems[
        currentIndex
      ];

    if(!item){
      return;
    }

    renderViewerMedia(
      mediaContainer,
      item
    );

    counter.textContent=
      `${currentIndex+1} of ${mediaItems.length}`;

    date.textContent=
      formatMediaDate(
        item.created_at
      );

    kind.textContent=
      item.media_kind===
      "video"
        ?"Video"
        :"Photo";

    previous.disabled=
      currentIndex===0;

    next.disabled=
      currentIndex===
      mediaItems.length-1;

    share.hidden=
      item.sharable!==
      true;
  }

  /*   previous memory*/
  previous.addEventListener(
    "click",
    event=>{
      event.stopPropagation();

      if(
        currentIndex<=0
      ){
        return;
      }

      currentIndex--;

      renderCurrent();
    }
  );

  /*   next memory*/
  next.addEventListener(
    "click",
    event=>{
      event.stopPropagation();

      if(
        currentIndex>=
        mediaItems.length-1
      ){
        return;
      }

      currentIndex++;

      renderCurrent();
    }
  );

  /*   download memory*/
  download.addEventListener(
    "click",
    async event=>{
      event.stopPropagation();

      const item=
        mediaItems[
          currentIndex
        ];

      await downloadMemoryMedia(
        item,
        download
      );
    }
  );

  /*   share memory*/
  share.addEventListener(
    "click",
    event=>{
      event.stopPropagation();

      const item=
        mediaItems[
          currentIndex
        ];

      if(
        !item||
        item.sharable!==
        true
      ){
        return;
      }

      window.dispatchEvent(
        new CustomEvent(
          "parent:share-memory",
          {
            detail:{
              media:item,
              index:currentIndex,
              mediaItems,
              collection
            }
          }
        )
      );
    }
  );

  renderCurrent();

  return article;
}
