/*   create image*/
function createViewerImage(item){
  const image=
    document.createElement(
      "img"
    );

  image.className=
    "memory-viewer-image";

  image.crossOrigin=
    "anonymous";

  image.src=
    item.media_url||
    item.thumbnail||
    "";

  image.alt=
    "Little Nest memory";

  image.draggable=false;

  return image;
}

/*   create video*/
function createViewerVideo(item){
  const video=
    document.createElement(
      "video"
    );

  video.className=
    "memory-viewer-video";

  video.crossOrigin=
    "anonymous";

  video.src=
    item.media_url||
    "";

  video.controls=true;
  video.playsInline=true;
  video.preload="metadata";

  return video;
}

/*   render viewer media*/
export function renderViewerMedia(
  container,
  item
){
  if(
    !container||
    !item
  ){
    return;
  }

  const existingVideo=
    container.querySelector(
      "video"
    );

  if(existingVideo){
    existingVideo.pause();
    existingVideo.removeAttribute(
      "src"
    );
    existingVideo.load();
  }

  container.innerHTML="";

  const mediaElement=
    item.media_kind===
    "video"
      ?createViewerVideo(
          item
        )
      :createViewerImage(
          item
        );

  container.appendChild(
    mediaElement
  );
}
