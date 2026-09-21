import{getStudent}from"./parent_data.js";

/*   create journey card*/
export function createJourneyCard(){
  const student=getStudent();
  const studentName=student?.preferred_name||student?.name||"Your little one";
  const article=document.createElement("article");
  article.className="experience journey-experience nest-section-experience";
  article.dataset.type="journey";
  article.innerHTML=`
    <div class="nest-section-card journey-stage-card">
      <div class="nest-section-heading">
        <span class="nest-section-kicker">Journey</span>
        <h2 class="nest-section-title">${studentName}'s Journey</h2>
        <p class="nest-section-copy">A look at how ${studentName} is growing.</p>
      </div>
    </div>
  `;
  return article;
}
