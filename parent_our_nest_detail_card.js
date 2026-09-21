const DETAIL_CONTENT={
  "family-access":{title:"Family Access",copy:"Choose who can be part of your family's Nest."},
  "parent-profile":{title:"Parent Profile",copy:"Your parent details and preferences."},
  "child-details":{title:"Child Details",copy:"Your child's information."},
  "notifications":{title:"Notifications",copy:"Choose how NestHome keeps you updated."},
  "settings":{title:"Settings",copy:"Your NestHome preferences."},
  "account-information":{title:"Account Information",copy:"Your account details."}
};

/*   create our nest detail card*/
export function createOurNestDetailCard(option){
  const detail=DETAIL_CONTENT[option]||DETAIL_CONTENT["settings"];
  const article=document.createElement("article");
  article.className="experience our-nest-detail-experience nest-section-experience";
  article.dataset.type="our-nest-detail";
  article.dataset.option=option;
  article.innerHTML=`
    <div class="nest-section-card our-nest-detail-card">
      <div class="nest-section-heading">
        <span class="nest-section-kicker">Our Nest</span>
        <h2 class="nest-section-title">${detail.title}</h2>
        <p class="nest-section-copy">${detail.copy}</p>
      </div>
    </div>
  `;
  return article;
}
