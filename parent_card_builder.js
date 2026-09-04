import{
  getExperiences
}from"./parent_experiences.js";

/*   get card type label*/
function getTypeLabel(type){
  return({
    session:"Story",
    learning:"Learning",
    activity:"Activity",
    personal:"Growth",
    moments:"Moments",
    home:"Together"
  })[type]||"Story";
}

/*   create experience card*/
function createExperienceCard(
  item,
  index,
  onOpen
){
  const article=
    document.createElement("article");

  article.className="experience";
  article.dataset.index=index;

  const typeLabel=
    getTypeLabel(item.type);

  article.innerHTML=`
    <div class="card">

      <div
        class="photo"
        style="
          background-image:
          url('${item.photo}')
        "
      ></div>

      <div class="type-mark">
        ${typeLabel}
      </div>

      <div class="content">

        <div class="moment-label">
          ${item.label}
        </div>

        <h2 class="moment-title">
          ${item.title}
        </h2>

        <p class="moment-copy">
          ${item.copy}
        </p>

        <div class="learn-row">

          ${
            item.categories
              .map(
                category=>`
                  <span class="learn-pill">
                    ${category}
                  </span>
                `
              )
              .join("")
          }

        </div>

      </div>

    </div>
  `;

  article.addEventListener(
    "click",
    ()=>{
      if(
        typeof onOpen===
        "function"
      ){
        onOpen(index);
      }
    }
  );

  return article;
}

/*   build experience cards*/
export function buildExperienceCards(
  carousel,
  onOpen
){
  if(!carousel){
    return;
  }

  const experiences=
    getExperiences();

  experiences.forEach(
    (
      item,
      index
    )=>{
      const card=
        createExperienceCard(
          item,
          index,
          onOpen
        );

      carousel.appendChild(card);
    }
  );
}
