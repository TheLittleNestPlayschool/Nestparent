function mixColor(a,b,amount){
  const ah=a.replace("#","");
  const bh=b.replace("#","");

  const ar=parseInt(ah.slice(0,2),16);
  const ag=parseInt(ah.slice(2,4),16);
  const ab=parseInt(ah.slice(4,6),16);

  const br=parseInt(bh.slice(0,2),16);
  const bg=parseInt(bh.slice(2,4),16);
  const bb=parseInt(bh.slice(4,6),16);

  const r=Math.round(ar+(br-ar)*amount);
  const g=Math.round(ag+(bg-ag)*amount);
  const blue=Math.round(ab+(bb-ab)*amount);

  return `rgb(${r} ${g} ${blue})`;
}

/*   time palettes*/
function getPalette(hour){
  const palettes={
    morning:[
      "#fff7dc",
      "#f6e7c9",
      "#e7efe0",
      "#fffaf1"
    ],
    afternoon:[
      "#e4efe4",
      "#d2e2d7",
      "#f5ead3",
      "#edf4e8"
    ],
    evening:[
      "#d9e3ee",
      "#d8d4e8",
      "#ece6de",
      "#cfdce7"
    ]
  };

  let from;
  let to;
  let amount;

  if(hour<11){
    from=palettes.morning;
    to=palettes.morning;
    amount=0;
  }else if(hour<14){
    from=palettes.morning;
    to=palettes.afternoon;
    amount=(hour-11)/3;
  }else if(hour<17){
    from=palettes.afternoon;
    to=palettes.afternoon;
    amount=0;
  }else if(hour<20){
    from=palettes.afternoon;
    to=palettes.evening;
    amount=(hour-17)/3;
  }else{
    from=palettes.evening;
    to=palettes.evening;
    amount=0;
  }

  return from.map((color,index)=>{
    return mixColor(
      color,
      to[index],
      amount
    );
  });
}

/*   apply time atmosphere*/
export function applyTimeAtmosphere(){
  const now=new Date();

  const hour=
    now.getHours()+
    now.getMinutes()/60;

  const palette=getPalette(hour);
  const root=document.documentElement;

  palette.forEach((color,index)=>{
    root.style.setProperty(
      `--time-c${index+1}`,
      color
    );
  });
}
