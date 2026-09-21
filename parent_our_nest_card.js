const OUR_NEST_OPTIONS=[
  {key:"family-access",icon:"♡",title:"Family Access",copy:"Choose who can be part of your family's Nest"},
  {key:"parent-profile",icon:"◯",title:"Parent Profile",copy:"Your details and parent preferences"},
  {key:"child-details",icon:"✦",title:"Child Details",copy:"Your child's information"},
  {key:"notifications",icon:"◌",title:"Notifications",copy:"How NestHome keeps you updated"},
  {key:"settings",icon:"⚙",title:"Settings",copy:"Your NestHome preferences"},
  {key:"account-information",icon:"i",title:"Account Information",copy:"Your account details"}
];

/*   create our nest card*/
export function createOurNestCard(){
  const article=document.createElement("article");
  article.className="experience our-nest-experience nest-section-experience";
  article.dataset.type="our-nest";
  article.innerHTML=`
    <div class="nest-section-card our-nest-stage-card">
      <div class="nest-section-heading">
        <span class="nest-section-kicker">Our Nest</span>
        <h2 class="nest-section-title">Your family space</h2>
        <p class="nest-section-copy">The people, details and settings around your Nest.</p>
      </div>
      <div class="our-nest-options">
        ${OUR_NEST_OPTIONS.map(item=>`
          <button class="our-nest-option" type="button" data-our-nest-option="${item.key}">
            <span class="our-nest-option-icon">${item.icon}</span>
            <span class="our-nest-option-title">${item.title}</span>
            <span class="our-nest-option-copy">${item.copy}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
  article.querySelectorAll(".our-nest-option").forEach(button=>{
    button.addEventListener("click",event=>{
      event.stopPropagation();
      window.dispatchEvent(new CustomEvent("parent:our-nest-option",{
        detail:{option:button.dataset.ourNestOption}
      }));
    });
  });
  return article;
}
