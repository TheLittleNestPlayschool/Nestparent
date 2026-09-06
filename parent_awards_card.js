import{
  getStudent
}from"./parent_data.js";
import{
  getAwardCategories,
  getAwardBadges,
  getStudentBadges
}from"./parent_awards_data.js";

/*   student name*/
function getStudentName(){
  const student=getStudent();
  return student?.preferred_name||student?.name||"Your little one";
}

/*   award graphic*/
function getAwardGraphic(category){
  const src=category?.award_graphic||"";
  return category?.code==="literacy"?`${src}?v=20260906-literacy-restore`:src;
}

/*   ordered categories*/
function getCategories(){
  return [...getAwardCategories()]
    .sort((a,b)=>
      Number(a.award_display_order)-
      Number(b.award_display_order)
    );
}

/*   category badges*/
function getCategoryBadges(categoryId){
  return getAwardBadges()
    .filter(badge=>
      Number(badge.development_category_id)===Number(categoryId)&&
      badge.is_active!==false
    )
    .sort((a,b)=>
      Number(a.sort_order||a.level)-
      Number(b.sort_order||b.level)
    );
}

/*   earned record*/
function getEarnedBadge(badgeId){
  return getStudentBadges().find(item=>
    Number(item.badge_id)===Number(badgeId)&&
    item.is_active!==false
  )||null;
}

/*   earned badges for category*/
function getCategoryEarned(categoryId){
  const badgeIds=new Set(
    getCategoryBadges(categoryId)
      .map(badge=>Number(badge.id))
  );

  return getStudentBadges()
    .filter(item=>
      item.is_active!==false&&
      badgeIds.has(Number(item.badge_id))
    );
}

/*   format date*/
function formatAwardDate(value){
  let timestamp=Number(value);
  if(!timestamp){return"";}
  if(timestamp<1000000000000){timestamp*=1000;}

  return new Intl.DateTimeFormat(
    "en",
    {
      month:"short",
      day:"numeric",
      year:"numeric"
    }
  ).format(new Date(timestamp));
}

/*   overview category*/
function buildCategoryButton(category){
  const earned=getCategoryEarned(category.id);
  const badges=getCategoryBadges(category.id);
  const earnedLevels=badges
    .filter(badge=>getEarnedBadge(badge.id))
    .map(badge=>Number(badge.level));
  const highest=earnedLevels.length?Math.max(...earnedLevels):0;

  return`
    <button
      class="award-category"
      type="button"
      data-award-category="${category.id}"
    >
      <span class="award-category-art">
        <img src="${getAwardGraphic(category)}" alt="" />
      </span>
      <span class="award-category-title">
        ${category.award_short_name||category.name}
      </span>
      <span class="award-category-status">
        ${
          earned.length===0
            ?"A story waiting to begin"
            :highest===1
              ?"1 milestone reached"
              :`${earned.length} milestones reached`
        }
      </span>
    </button>
  `;
}

/*   create awards overview*/
export function createAwardsCard({onCategory}={}){
  const article=document.createElement("article");
  const studentName=getStudentName();
  const categories=getCategories();
  const earnedCount=getStudentBadges()
    .filter(item=>item.is_active!==false)
    .length;

  article.className="experience awards-experience";
  article.dataset.type="awards";
  article.innerHTML=`
    <div class="awards-stage-card">
      <div class="awards-heading">
        <h2 class="awards-title">${studentName}'s Awards</h2>
        <span class="awards-total">
          ${earnedCount} ${earnedCount===1?"milestone":"milestones"} gathered
        </span>
      </div>
      <div class="award-categories">
        ${categories.map(buildCategoryButton).join("")}
      </div>
    </div>
  `;

  article.querySelectorAll(".award-category").forEach(button=>{
    button.addEventListener("click",event=>{
      event.stopPropagation();
      const categoryId=Number(button.dataset.awardCategory);
      if(typeof onCategory==="function"){
        onCategory(categoryId);
      }
    });
  });

  return article;
}

/*   create category history*/
export function createAwardCategoryCard({categoryId,onAward}={}){
  const article=document.createElement("article");
  const category=getCategories().find(item=>Number(item.id)===Number(categoryId));
  const badges=getCategoryBadges(categoryId);
  const studentName=getStudentName();

  article.className="experience award-category-experience";
  article.dataset.type="award-category";
  article.dataset.categoryId=String(categoryId);

  if(!category){
    article.innerHTML=`<div class="awards-stage-card"></div>`;
    return article;
  }

  article.innerHTML=`
    <div class="awards-stage-card award-history-card">
      <div class="award-history-heading">
        <span class="award-history-art">
          <img src="${getAwardGraphic(category)}" alt="" />
        </span>
        <div>
          <span class="awards-kicker">${studentName}'s journey</span>
          <h2 class="award-history-title">${category.award_short_name||category.name}</h2>
        </div>
      </div>
      <p class="award-history-copy">${category.award_parent_description||""}</p>
      <div class="award-milestones">
        ${badges.map(badge=>{
          const earned=getEarnedBadge(badge.id);
          return`
            <button
              class="award-milestone${earned?" is-earned":""}"
              type="button"
              data-award-badge="${badge.id}"
              ${earned?"":"disabled"}
            >
              <span class="award-milestone-level">Level ${badge.level}</span>
              <span class="award-milestone-title">
                ${earned?badge.parent_title:"Still ahead"}
              </span>
              <span class="award-milestone-date">
                ${earned?formatAwardDate(earned.earned_at):""}
              </span>
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;

  article.querySelectorAll(".award-milestone.is-earned").forEach(button=>{
    button.addEventListener("click",event=>{
      event.stopPropagation();
      const badgeId=Number(button.dataset.awardBadge);
      if(typeof onAward==="function"){
        onAward({categoryId:Number(categoryId),badgeId});
      }
    });
  });

  return article;
}

/*   create award detail*/
export function createAwardDetailCard({categoryId,badgeId}={}){
  const article=document.createElement("article");
  const category=getCategories().find(item=>Number(item.id)===Number(categoryId));
  const badge=getAwardBadges().find(item=>Number(item.id)===Number(badgeId));
  const earned=getEarnedBadge(badgeId);
  const studentName=getStudentName();

  article.className="experience award-detail-experience";
  article.dataset.type="award-detail";

  if(!category||!badge||!earned){
    article.innerHTML=`<div class="awards-stage-card"></div>`;
    return article;
  }

  article.innerHTML=`
    <div class="awards-stage-card award-detail-card">
      <span class="awards-kicker">A little milestone to celebrate</span>
      <div class="award-detail-art">
        <img src="${getAwardGraphic(category)}" alt="" />
      </div>
      <span class="award-detail-category">
        ${category.award_short_name||category.name} · Level ${badge.level}
      </span>
      <h2 class="award-detail-title">${badge.parent_title}</h2>
      <p class="award-detail-message">${badge.parent_message}</p>
      <div class="award-detail-earned">
        <span>Earned by ${studentName}</span>
        <strong>${formatAwardDate(earned.earned_at)}</strong>
      </div>
    </div>
  `;

  return article;
}
