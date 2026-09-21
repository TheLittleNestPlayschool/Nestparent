import{
  loadParentLanguages,
  updateParentLanguage,
  getSelectedLanguageId,
  getLanguageLabel,
  getLanguageCode,
  getLanguageNativeName
}from"./parent_language_data.js?v=1";

/*   escape text*/
function escapeHtml(value){
  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/*   create language card*/
export function createLanguageCard(){
  const article=document.createElement("article");
  article.className="experience language-experience nest-section-experience";
  article.dataset.type="language";
  article.innerHTML=`
    <div class="nest-section-card language-card">
      <div class="nest-section-heading language-heading">
        <span class="nest-section-kicker">Settings</span>
        <h2 class="nest-section-title">Language</h2>
        <p class="nest-section-copy">Choose the language you prefer to use in NestHome.</p>
      </div>
      <div class="language-scroll">
        <div class="language-list" data-language-list>
          <div class="language-loading">Loading languages…</div>
        </div>
      </div>
      <div class="language-status" data-language-status aria-live="polite"></div>
    </div>
  `;
  return article;
}

/*   render languages*/
function renderLanguages(article,languages){
  const list=article.querySelector("[data-language-list]");
  if(!list)return;
  const selectedId=getSelectedLanguageId();
  if(!languages.length){
    list.innerHTML='<div class="language-empty">No languages are available yet.</div>';
    return;
  }
  list.innerHTML=languages.map((language,index)=>{
    const id=Number(language?.id);
    const label=getLanguageLabel(language);
    const nativeName=getLanguageNativeName(language);
    const code=getLanguageCode(language);
    const selected=id===selectedId;
    const detail=nativeName||code;
    return`
      <button class="language-option${selected?" is-selected":""}" type="button" data-language-id="${id}" style="--language-index:${index}">
        <span class="language-option-copy">
          <span class="language-option-title">${escapeHtml(label)}</span>
          ${detail?`<span class="language-option-detail">${escapeHtml(detail)}</span>`:""}
        </span>
        <span class="language-option-state">${selected?"Selected":""}</span>
      </button>
    `;
  }).join("");
  article.querySelectorAll("[data-language-id]").forEach(button=>{
    button.addEventListener("click",()=>saveLanguage(article,button));
  });
}

/*   save language*/
async function saveLanguage(article,button){
  const languageId=Number(button.dataset.languageId);
  if(!languageId||languageId===getSelectedLanguageId())return;
  const status=article.querySelector("[data-language-status]");
  const buttons=[...article.querySelectorAll("[data-language-id]")];
  const title=button.querySelector(".language-option-title")?.textContent||"Language";
  buttons.forEach(item=>item.disabled=true);
  button.classList.add("is-saving");
  if(status)status.textContent=`Saving ${title}…`;
  try{
    await updateParentLanguage(languageId);
    buttons.forEach(item=>{
      const selected=Number(item.dataset.languageId)===languageId;
      item.classList.toggle("is-selected",selected);
      const state=item.querySelector(".language-option-state");
      if(state)state.textContent=selected?"Selected":"";
    });
    if(status)status.textContent=`${title} saved.`;
  }catch(error){
    if(status)status.textContent=error?.message||"Unable to save your language.";
  }finally{
    button.classList.remove("is-saving");
    buttons.forEach(item=>item.disabled=false);
  }
}

/*   load language card*/
export async function loadLanguageCard(article){
  const list=article?.querySelector("[data-language-list]");
  const status=article?.querySelector("[data-language-status]");
  if(!article||!list)return;
  try{
    const languages=await loadParentLanguages();
    renderLanguages(article,languages);
  }catch(error){
    list.innerHTML=`<div class="language-error">${escapeHtml(error?.message||"Unable to load languages.")}</div>`;
    if(status)status.textContent="";
  }
}
