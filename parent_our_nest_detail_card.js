const DETAIL_CONTENT={
  "family-access":{title:"Family Access",copy:"Choose who can be part of your family's Nest and what they can access."},
  "parent-profile":{title:"Parent Profile",copy:"Your name, contact details and parent preferences."},
  "child-details":{title:"Child Details",copy:"Your child's personal and playschool information."},
  "notifications":{title:"Notifications",copy:"Choose how NestHome keeps you updated."},
  "settings":{title:"Settings",copy:"Language and other NestHome app preferences."},
  "account-security":{
    title:"Account & Security",
    copy:"Your login, password, privacy and account access.",
    items:[
      {title:"Login Email",copy:"The email used to sign in"},
      {title:"Change Password",copy:"Update your NestHome password"},
      {title:"Privacy Policy",copy:"How NestHome handles your family's information"},
      {title:"Terms of Use",copy:"NestHome terms and conditions"},
      {title:"Sign Out",copy:"Sign out of NestHome on this device"}
    ]
  }
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
      ${detail.items?`
        <div class="our-nest-detail-menu">
          ${detail.items.map(item=>`
            <div class="our-nest-detail-row">
              <span class="our-nest-detail-row-title">${item.title}</span>
              <span class="our-nest-detail-row-copy">${item.copy}</span>
            </div>
          `).join("")}
        </div>
      `:""}
    </div>
  `;
  return article;
}
