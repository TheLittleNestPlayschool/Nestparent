import {
  memoriesOverview,
  memoryChapters,
  memoryCollections
} from "./parent_memories_data.js";


/*   build special collections*/

function buildMemoryCollections(){

  const availableCollections =
    memoryCollections.filter(
      collection=>
        collection.available
    );


  if(
    availableCollections.length ===
    0
  ){
    return "";
  }


  return `
    <div class="memory-specials">

      ${
        availableCollections
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

export function createMemoriesCard(){

  const article =
    document.createElement(
      "article"
    );


  article.className =
    "experience memories-experience";


  article.dataset.type =
    "memories";


  article.innerHTML = `
    <div class="memories-stage-card">

      <div class="memories-hero">

        <div
          class="memories-photo"
          style="
            background-image:
            url('${memoriesOverview.photo}')
          "
        ></div>

        <div class="memories-photo-shade"></div>

        <div class="memories-heading">

          <span class="memories-kicker">
            ${memoriesOverview.label}
          </span>

          <h2 class="memories-title">
            ${memoriesOverview.title}
          </h2>

          <p class="memories-copy">
            ${memoriesOverview.copy}
          </p>

          <div class="memories-count">
            ${memoriesOverview.count}
            little moments saved
          </div>

          ${
            buildMemoryCollections()
          }

        </div>

      </div>


      <div class="memory-chapters">

        ${
          memoryChapters
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


            const chapter =
              button.dataset.memoryChapter;


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


            const collection =
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
