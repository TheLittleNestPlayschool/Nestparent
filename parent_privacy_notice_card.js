/*   escape notice text*/
function escapeHTML(value){
  return String(value||"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/*   simple inline markdown*/
function inlineMarkdown(value){
  return escapeHTML(value).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
}

/*   privacy notice markdown*/
function renderPrivacyNotice(markdown){
  const lines=String(markdown||"").split(/\r?\n/);
  let html="";
  let inList=false;
  let skippedTitle=false;

  const closeList=()=>{
    if(!inList)return;
    html+="</ul>";
    inList=false;
  };

  lines.forEach(rawLine=>{
    const line=rawLine.trim();

    if(!line){
      closeList();
      return;
    }

    if(line==="---"){
      closeList();
      return;
    }

    if(line.startsWith("# ")){
      closeList();
      if(!skippedTitle){
        skippedTitle=true;
        return;
      }
      html+=`<h2>${inlineMarkdown(line.slice(2))}</h2>`;
      return;
    }

    if(line.startsWith("## ")){
      closeList();
      html+=`<h3>${inlineMarkdown(line.slice(3))}</h3>`;
      return;
    }

    if(line.startsWith("### ")){
      closeList();
      html+=`<h4>${inlineMarkdown(line.slice(4))}</h4>`;
      return;
    }

    if(line.startsWith("- ")){
      if(!inList){
        html+="<ul>";
        inList=true;
      }
      html+=`<li>${inlineMarkdown(line.slice(2))}</li>`;
      return;
    }

    closeList();
    html+=`<p>${inlineMarkdown(line)}</p>`;
  });

  closeList();
  return html;
}

/*   create privacy notice card*/
export function createPrivacyNoticeCard(){
  const article=document.createElement("article");
  article.className="experience privacy-notice-experience nest-section-experience";
  article.dataset.type="privacy-notice";
  article.innerHTML=`
    <div class="nest-section-card privacy-notice-card">
      <div class="nest-section-heading privacy-notice-heading">
        <span class="nest-section-kicker">Account &amp; Security</span>
        <h2 class="nest-section-title">Privacy Notice</h2>
        <p class="nest-section-copy">How NestHome handles your family's information.</p>
      </div>
      <div class="privacy-notice-scroll">
        <div class="privacy-notice-body">
          <p class="privacy-notice-loading">Opening Privacy Notice…</p>
        </div>
      </div>
    </div>
  `;
  return article;
}

/*   load privacy notice*/
export async function loadPrivacyNoticeCard(article){
  const body=article?.querySelector(".privacy-notice-body");
  if(!body)return;

  try{
    const response=await fetch("./privacy_notice.md?v=1",{cache:"no-store"});
    if(!response.ok)throw new Error("Unable to load Privacy Notice.");
    const markdown=await response.text();
    body.innerHTML=renderPrivacyNotice(markdown);
  }catch(error){
    body.innerHTML=`
      <p class="privacy-notice-error">
        ${escapeHTML(error?.message||"Unable to load Privacy Notice.")}
      </p>
    `;
  }
}
