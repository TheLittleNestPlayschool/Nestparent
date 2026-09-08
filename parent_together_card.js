import{
  getStudent,
  getCurrentSessionDetails
}from"./parent_data.js";

/*   escape html*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function getText(value){
  return typeof value==="string"?value.trim():"";
}

function getTopics(session){
  return [...new Set([
    getText(session?.session_theme),
    getText(session?.lesson_1_title),
    getText(session?.lesson_2_title),
    getText(session?.manner_topic)
  ].filter(Boolean))].slice(0,3);
}

function buildAskMeAbout(topics,studentName){
  if(!topics.length){
    return[`Ask ${studentName} about one thing that made them smile today.`];
  }
  return topics.map(topic=>`Ask me about ${topic}.`);
}

function buildConversationStarters(topics,studentName){
  const primary=topics[0];
  const secondary=topics[1];
  const starters=[];
  if(primary){starters.push(`What was your favorite part of ${primary}?`);}
  if(secondary){starters.push(`Can you show me or tell me something you remember about ${secondary}?`);}
  starters.push(`What made you smile at The Little Nest today, ${studentName}?`);
  return starters.slice(0,3);
}

function buildPromptList(items){
  if(!items.length){return"";}
  return`
    <div class="together-detail-prompts">
      ${items.map(item=>`<div>${escapeHtml(item)}</div>`).join("")}
    </div>
  `;
}

/*   create expanded together card*/
export function createTogetherCard(item){
  const student=getStudent();
  const session=getCurrentSessionDetails()||{};
  const studentName=student?.preferred_name||student?.name||"your little one";
  const topics=getTopics(session);
  const askMeAbout=buildAskMeAbout(topics,studentName);
  const starters=buildConversationStarters(topics,studentName);
  const homeActivity=getText(session?.home_time_activity);
  const nextDescription=getText(session?.next_description);
  const article=document.createElement("article");
  article.className="experience together-detail-experience";
  article.dataset.experienceType="together-detail";

  article.innerHTML=`
    <div class="card together-detail-card">
      <div class="type-mark">TOGETHER</div>
      <div class="together-detail-hero" style="background-image:url('${escapeHtml(item?.photo||"")}')"></div>
      <div class="together-detail-hero-shade"></div>
      <div class="together-detail-scroll">
        <header class="together-detail-header">
          <div class="together-detail-label">Together</div>
          <h2>A Little Bridge Back Home</h2>
          <p class="together-detail-lead">A few easy ways to turn ${escapeHtml(studentName)}'s Little Nest day into a conversation, a laugh or a tiny moment together.</p>
        </header>
        <div class="together-detail-body">
          <section class="together-detail-section together-detail-ask">
            <div class="together-detail-kicker">Ask Me About</div>
            ${buildPromptList(askMeAbout)}
          </section>
          <section class="together-detail-section">
            <div class="together-detail-kicker">Conversation Starters</div>
            ${buildPromptList(starters)}
          </section>
          ${homeActivity?`
            <section class="together-detail-section together-detail-home">
              <div class="together-detail-kicker">Try This Together</div>
              <p>${escapeHtml(homeActivity)}</p>
              <span>Keep it light, playful and completely optional.</span>
            </section>
          `:""}
          ${!homeActivity&&nextDescription?`
            <section class="together-detail-section together-detail-next">
              <div class="together-detail-kicker">A Little Look Ahead</div>
              <p>${escapeHtml(nextDescription)}</p>
            </section>
          `:""}
        </div>
      </div>
    </div>
  `;

  return article;
}
