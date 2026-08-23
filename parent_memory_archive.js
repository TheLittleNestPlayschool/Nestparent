/*   archive data*/

const archiveGroups = [
  {
    id:"july-2026",
    title:"July 2026",
    copy:"The month before August",
    count:28
  },
  {
    id:"june-2026",
    title:"June 2026",
    copy:"Little moments from early summer",
    count:34
  },
  {
    id:"may-2026",
    title:"May 2026",
    copy:"A month full of growing",
    count:29
  },
  {
    id:"april-2026",
    title:"April 2026",
    copy:"Earlier pieces of Mia's story",
    count:22
  }
];

/*   create archive card*/

export function createMemoryArchiveCard(){
  const article =
    document.createElement(
      "article"
    );

  article.className =
    "experience memory-archive-experience";

  article.dataset.type =
    "memory-archive";

  article.innerHTML = `
    <div class="memory-archive-card">
      <div class="memory-archive-heading">
        <span class="memory-archive-kicker">
          Mia's Story So Far
        </span>

        <h2 class="memory-archive-title">
          Wander a little further back.
        </h2>

        <p class="memory-archive-copy">
          Her earlier Little Nest moments are
          waiting here whenever you want to
          return to them.
        </p>
      </div>

      <div class="memory-archive-list">
        ${
          archiveGroups
            .map(
              group=>`
                <button
                  class="memory-archive-item"
                  type="button"
                  data-memory-archive="${group.id}"
                >
                  <span class="memory-archive-item-title">
                    ${group.title}
                  </span>

                  <span class="memory-archive-item-copy">
                    ${group.copy}
                  </span>

                  <span class="memory-archive-item-count">
                    ${group.count} moments
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
      ".memory-archive-item"
    )
    .forEach(
      button=>{
        button.addEventListener(
          "click",
          event=>{
            event.stopPropagation();

            const archive =
              button.dataset.memoryArchive;

            window.dispatchEvent(
              new CustomEvent(
                "parent:memory-archive",
                {
                  detail:{
                    archive
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
