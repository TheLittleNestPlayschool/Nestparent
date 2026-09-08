let starsContainer = null;

/*   create stars*/
export function createArrivalStars(arrivalScreen,arrivalCopy){
  if(!arrivalScreen){return;}
  starsContainer=document.createElement("div");
  starsContainer.className="arrival-stars";
  starsContainer.setAttribute("aria-hidden","true");

  const starPositions=[
    [8,13],
    [90,20],
    [6,55],
    [93,64],
    [9,91],
    [72,92]
  ];

  starPositions.forEach((position,index)=>{
    const star=document.createElement("span");
    star.className="arrival-star is-ice is-feature";

    const speed=1900+(index%6)*420;
    const delay=(index%6)*-340;
    const leaveDelay=(index*67)%720;

    star.style.setProperty("--star-x",`${position[0]}%`);
    star.style.setProperty("--star-y",`${position[1]}%`);
    star.style.setProperty("--star-size","5.5px");
    star.style.setProperty("--star-opacity",1);
    star.style.setProperty("--star-speed",`${speed}ms`);
    star.style.setProperty("--star-delay",`${delay}ms`);
    star.style.setProperty("--leave-delay",`${leaveDelay}ms`);

    starsContainer.appendChild(star);
  });

  arrivalScreen.insertBefore(starsContainer,arrivalCopy);
}

/*   release stars*/
export function releaseArrivalStars(){
  if(!starsContainer){return;}
  starsContainer.classList.add("is-leaving");
  window.setTimeout(()=>{
    if(starsContainer){
      starsContainer.remove();
      starsContainer=null;
    }
  },1850);
}
