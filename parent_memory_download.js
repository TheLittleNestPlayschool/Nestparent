/*   get download filename*/
function getDownloadFilename(item){
  const original=
    item?.original_filename||
    "";

  const filename=
    original
      .split("/")
      .pop();

  if(filename){
    return filename;
  }

  if(
    item?.media_kind===
    "video"
  ){
    return"little-nest-memory.mp4";
  }

  return"little-nest-memory.jpg";
}

/*   download memory media*/
export async function downloadMemoryMedia(
  item,
  button
){
  if(
    !item||
    !item.media_url||
    !button
  ){
    return;
  }

  if(
    button.dataset.downloading===
    "true"
  ){
    return;
  }

  button.dataset.downloading=
    "true";

  button.disabled=true;

  const label=
    button.querySelector(
      ".memory-viewer-download-label"
    );

  if(label){
    label.textContent=
      "Saving...";
  }

  try{
    const response=
      await fetch(
        item.media_url,
        {
          method:"GET",
          mode:"cors",
          cache:"no-store"
        }
      );

    if(!response.ok){
      throw new Error(
        `Unable to download media. HTTP ${response.status}`
      );
    }

    const blob=
      await response.blob();

    const objectUrl=
      URL.createObjectURL(
        blob
      );

    const link=
      document.createElement(
        "a"
      );

    link.href=
      objectUrl;

    link.download=
      getDownloadFilename(
        item
      );

    link.style.display=
      "none";

    document.body.appendChild(
      link
    );

    link.click();

    link.remove();

    window.setTimeout(
      ()=>{
        URL.revokeObjectURL(
          objectUrl
        );
      },
      1500
    );
  }

  catch(error){
    console.error(
      "MEMORY DOWNLOAD ERROR",
      error
    );
  }

  finally{
    button.dataset.downloading=
      "false";

    button.disabled=false;

    if(label){
      label.textContent=
        "Download";
    }
  }
}
