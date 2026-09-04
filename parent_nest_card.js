import{
  getStudent
}from"./parent_data.js";

/*   create nest card*/
export function createNestCard(){
  const student=
    getStudent();

  const studentName=
    student?.preferred_name||
    student?.name||
    "your little one";

  const article=
    document.createElement(
      "article"
    );

  article.className=
    "experience nest-experience";

  article.dataset.type=
    "nest";

  article.innerHTML=`
    <div class="nest-stage-card">

      <div class="nest-card-heading">

        <h2 class="nest-card-title">
          Where would you like to wander?
        </h2>

      </div>

      <div class="nest-destinations">

        <button
          class="nest-destination"
          type="button"
          data-destination="memories"
        >

          <span class="nest-destination-icon">
            ♡
          </span>

          <span class="nest-destination-title">
            Memories
          </span>

          <span class="nest-destination-copy">
            Photos, videos and moments
          </span>

        </button>

        <button
          class="nest-destination"
          type="button"
          data-destination="journey"
        >

          <span class="nest-destination-icon">
            ✦
          </span>

          <span class="nest-destination-title">
            Journey
          </span>

          <span class="nest-destination-copy">
            See how ${studentName} is growing
          </span>

        </button>

        <button
          class="nest-destination"
          type="button"
          data-destination="home"
        >

          <span class="nest-destination-icon">
            ⌂
          </span>

          <span class="nest-destination-title">
            Home
          </span>

          <span class="nest-destination-copy">
            Little things to share together
          </span>

        </button>

        <button
          class="nest-destination"
          type="button"
          data-destination="more"
        >

          <span class="nest-destination-icon">
            •••
          </span>

          <span class="nest-destination-title">
            More
          </span>

          <span class="nest-destination-copy">
            Family and account options
          </span>

        </button>

      </div>

    </div>
  `;

  article
    .querySelectorAll(
      ".nest-destination"
    )
    .forEach(
      button=>{
        button.addEventListener(
          "click",
          event=>{
            event.stopPropagation();

            const destination=
              button.dataset.destination;

            window.dispatchEvent(
              new CustomEvent(
                "parent:nest-destination",
                {
                  detail:{
                    destination
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
