const atmosphere=
  document.querySelector(
    ".time-atmosphere"
  );

const palettes={
  session:{
    primary:"#75b957",
    secondary:"#f2b84b",
    accent:"#54bbb0"
  },
  learning:{
    primary:"#55beb8",
    secondary:"#ef987c",
    accent:"#f0c34f"
  },
  activity:{
    primary:"#ef856e",
    secondary:"#f2c24d",
    accent:"#62bdb1"
  },
  personal:{
    primary:"#a98bd2",
    secondary:"#e594aa",
    accent:"#72b783"
  },
  world:{
    primary:"#62b5d2",
    secondary:"#68c18d",
    accent:"#efbd52"
  },
  home:{
    primary:"#eea96c",
    secondary:"#d98c98",
    accent:"#82b27e"
  }
};

let restingLayer=null;

/*   build resting atmosphere*/
function buildRestingAtmosphere(){
  if(
    !atmosphere||
    restingLayer
  ){
    return;
  }

  restingLayer=
    document.createElement(
      "div"
    );

  restingLayer.className=
    "resting-atmosphere";

  restingLayer.innerHTML=`
    <span class="experience-aura aura-primary"></span>
    <span class="experience-aura aura-secondary"></span>

    <span class="resting-bloom bloom-left"></span>
    <span class="resting-bloom bloom-right"></span>
    <span class="resting-bloom bloom-bottom"></span>

    <span class="resting-spark spark-one">✦</span>
    <span class="resting-spark spark-two">✦</span>
    <span class="resting-spark spark-three">✦</span>
    <span class="resting-spark spark-four">✦</span>
  `;

  atmosphere.appendChild(
    restingLayer
  );
}

/*   get palette*/
function getPalette(experience){
  return(
    palettes[
      experience?.type
    ]||
    palettes.session
  );
}

/*   set resting atmosphere*/
export function setRestingAtmosphere(
  experience
){
  buildRestingAtmosphere();

  if(!restingLayer){
    return;
  }

  const palette=
    getPalette(
      experience
    );

  const primary=
    restingLayer.querySelector(
      ".aura-primary"
    );

  const secondary=
    restingLayer.querySelector(
      ".aura-secondary"
    );

  const left=
    restingLayer.querySelector(
      ".bloom-left"
    );

  const right=
    restingLayer.querySelector(
      ".bloom-right"
    );

  const bottom=
    restingLayer.querySelector(
      ".bloom-bottom"
    );

  if(primary){
    primary.style.backgroundColor=
      palette.primary;
  }

  if(secondary){
    secondary.style.backgroundColor=
      palette.secondary;
  }

  if(left){
    left.style.backgroundColor=
      palette.accent;
  }

  if(right){
    right.style.backgroundColor=
      palette.secondary;
  }

  if(bottom){
    bottom.style.backgroundColor=
      palette.primary;
  }
}

/*   activate resting atmosphere*/
export function activateRestingAtmosphere(
  experience
){
  buildRestingAtmosphere();

  setRestingAtmosphere(
    experience
  );
}
