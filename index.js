const experiences = [
  {
    type: "session",
    title: "Mia just finished Session 1.",
    label: "Today at The Little Nest",
    copy: "Letter A, Number 1, movement, listening and self-expression were all part of her morning.",
    photo: "https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=1200&q=86",
    categories: ["Letter A", "Number 1", "Movement"],
    deeper: "Session 1 introduces Letter A and Number 1 while weaving in movement, listening, speaking and personal development. This is curriculum truth: we know Mia attended this session and these were the learning opportunities built into it.",
    learning: [
      [
        "🔤",
        "Literacy",
        "A core focus on early letter work, including uppercase Letter A."
      ],
      [
        "🔢",
        "Numeracy",
        "An early introduction to Number 1."
      ],
      [
        "💬",
        "Oral Language",
        "Active participation and speaking are strongly built into the session."
      ],
      [
        "👂",
        "Listening & Understanding",
        "Listening to instructions and following along are part of the session."
      ]
    ]
  },

  {
    type: "learning",
    title: "Little hands had a lot to do.",
    label: "A big part of today's learning",
    copy: "Today's activities gave Mia opportunities to practice grip, control and careful hand movements.",
    photo: "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&w=1200&q=86",
    categories: [
      "Careful hand movements",
      "Growing independence",
      "Moving while learning"
    ],
    deeper: "Fine motor development is one of the strongest ingredients in Session 1. The weighting stays behind the scenes and simply helps the Stage Engine decide what deserves more attention.",
    learning: [
      [
        "🤲",
        "Careful hand movements",
        "The session gives children strong opportunities to practice pencil grip and controlled hand movement."
      ],
      [
        "🌱",
        "Growing independence",
        "Personal development is strongly woven into the session through participation and self-directed activity."
      ],
      [
        "🏃",
        "Moving while learning",
        "Physical movement is an important part of the session rather than something separate from learning."
      ],
      [
        "🎨",
        "Creating and expressing",
        "Creative movement and expression are also present as a quieter part of the session."
      ]
    ]
  },

  {
    type: "activity",
    title: "Learning through movement.",
    label: "One part of today's session",
    copy: "The Name Movement Game gives children a chance to move, participate and connect their bodies with the group experience.",
    photo: "https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=1200&q=86",
    categories: [
      "Name Movement Game",
      "Movement",
      "Participation"
    ],
    deeper: "The physical activity field gives us something concrete to show families even when no teacher note exists. We can explain what was built into the session without claiming exactly how Mia personally performed.",
    learning: [
      [
        "🏃",
        "Movement",
        "The planned activity uses physical movement as part of learning."
      ],
      [
        "💬",
        "Participation",
        "The session encourages active participation rather than passive watching."
      ],
      [
        "👂",
        "Listening",
        "Children need to listen and respond as the group activity unfolds."
      ]
    ]
  },

  {
    type: "personal",
    title: "There was also room for Mia to be Mia.",
    label: "Growing through the session",
    copy: "Session 1 gives children strong opportunities to participate, express themselves and build independence.",
    photo: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1200&q=86",
    categories: [
      "Growing independence",
      "Finding her voice",
      "Listening"
    ],
    deeper: "Session 1 is not only about letters and numbers. Personal development and oral language are both strongly represented, which tells us that participation, expression and interaction are central ingredients too.",
    learning: [
      [
        "🌿",
        "Growing independence",
        "The session creates opportunities for children to participate, make choices and become more comfortable doing things themselves."
      ],
      [
        "💬",
        "Finding her voice",
        "Speaking and active verbal participation are a major part of the experience."
      ],
      [
        "👂",
        "Listening and understanding",
        "Listening and responding remain an important supporting skill throughout the session."
      ]
    ]
  },

  {
    type: "world",
    title: "A small piece of the world around her.",
    label: "Also woven into today",
    copy: "Session 1 includes a lighter layer of exploration beyond letters and numbers.",
    photo: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=86",
    categories: [
      "Exploring her world",
      "Everyday discovery"
    ],
    deeper: "The My World area has a lighter contribution in Session 1. It does not need to dominate the experience, but it can remain quietly present as part of the full session story.",
    learning: [
      [
        "🌎",
        "Discovering the world around her",
        "Exploring everyday objects and familiar surroundings is part of the session."
      ],
      [
        "✨",
        "A quieter learning thread",
        "Because this area is less strongly emphasized today, the Stage Engine can keep it in the background rather than making it the main story."
      ]
    ]
  },

  {
    type: "home",
    title: "One tiny bridge back home.",
    label: "Continue the connection",
    copy: "Session 1 includes a home-time activity called “Name That Friend.”",
    photo: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=1200&q=86",
    categories: [
      "Name That Friend",
      "Optional at home"
    ],
    deeper: "The home-time activity gives us a natural way to continue the Little Nest experience without turning home into homework. It can appear only when the Stage Engine thinks it is useful.",
    learning: [
      [
        "🏡",
        "Name That Friend",
        "A simple home connection drawn directly from Session 1."
      ],
      [
        "💛",
        "Keep it light",
        "This should feel like a little continuation of the child's day, never an assignment."
      ],
      [
        "→",
        "What comes next",
        "The session table also gives us a next-description field that can later support a gentle preview of the next session."
      ]
    ]
  }
];


/* ==================================================
   DOM
   ================================================== */

const carousel =
  document.getElementById("carousel");

const hint =
  document.getElementById("hint");

const deepSheet =
  document.getElementById("deepSheet");

const sheetTitle =
  document.getElementById("sheetTitle");

const sheetCopy =
  document.getElementById("sheetCopy");

const learningList =
  document.getElementById("learningList");

const sheetClose =
  document.getElementById("sheetClose");

const wash =
  document.getElementById("wash");

const navOrb =
  document.getElementById("navOrb");

const navPanel =
  document.getElementById("navPanel");

const appRoot =
  document.getElementById("app");

const arrivalScreen =
  document.getElementById("arrivalScreen");

const arrivalGreeting =
  document.getElementById("arrivalGreeting");

const arrivalMessage =
  document.getElementById("arrivalMessage");


/* ==================================================
   CAROUSEL STATE
   ================================================== */

let activeIndex = 0;

let startX = 0;

let deltaX = 0;

let dragging = false;

let hasInteracted = false;


/* ==================================================
   BUILD CARDS
   ================================================== */

function buildCards(){

  experiences.forEach(
    (item,index)=>{

      const article =
        document.createElement(
          "article"
        );

      article.className =
        "experience";

      article.dataset.index =
        index;


      const typeLabel =
        ({
          session:"Story",
          learning:"Learning",
          activity:"Activity",
          personal:"Growth",
          world:"My World",
          home:"Home"
        })[item.type]
        ||
        "Story";


      article.innerHTML = `
        <div class="card">

          <div
            class="photo"
            style="
              background-image:
              url('${item.photo}')
            "
          ></div>

          <div class="type-mark">
            ${typeLabel}
          </div>

          <div class="content">

            <div class="moment-label">
              ${item.label}
            </div>

            <h2 class="moment-title">
              ${item.title}
            </h2>

            <p class="moment-copy">
              ${item.copy}
            </p>

            <div class="learn-row">

              ${
                item.categories
                  .map(
                    category => `
                      <span class="learn-pill">
                        ${category}
                      </span>
                    `
                  )
                  .join("")
              }

            </div>

          </div>

        </div>
      `;


      article.addEventListener(
        "click",
        ()=>{

          if(
            Math.abs(deltaX) < 8
            &&
            Number(
              article.dataset.index
            ) === activeIndex
          ){
            openDeep(
              activeIndex
            );
          }

        }
      );


      carousel.appendChild(
        article
      );

    }
  );


  renderPositions();
}


/* ==================================================
   CARD POSITIONING
   ================================================== */

function renderPositions(){

  const cards = [
    ...document.querySelectorAll(
      ".experience"
    )
  ];


  cards.forEach(
    (card,index)=>{

      const offset =
        index - activeIndex;


      if(
        offset < -2
        ||
        offset > 2
      ){

        card.style.opacity =
          "0";

        card.style.pointerEvents =
          "none";

        card.style.transform = `
          translate(-50%,-50%)
          translateX(${offset * 64}%)
          scale(.74)
        `;

        card.style.filter =
          "blur(9px)";

        card.dataset.pos =
          offset;

        return;
      }


      const x =
        offset * 73;

      const scale =
        offset === 0
          ? 1
          : .86;

      const rotate =
        offset * -2.6;

      const z =
        offset === 0
          ? 0
          : -90;

      const y =
        Math.abs(offset) * 10;

      const opacity =
        offset === 0
          ? 1
          : .46;


      card.style.opacity =
        opacity;

      card.style.pointerEvents =
        offset === 0
          ? "auto"
          : "none";

      card.style.filter =
        offset === 0
          ? "blur(0px)"
          : "blur(1.4px)";

      card.style.transform = `
        translate(-50%,-50%)
        translate3d(
          ${x}%,
          ${y}px,
          ${z}px
        )
        rotate(${rotate}deg)
        scale(${scale})
      `;

      card.style.zIndex =
        10 -
        Math.abs(offset);

      card.dataset.pos =
        offset;

    }
  );
}


/* ==================================================
   MOVE CAROUSEL
   ================================================== */

function move(direction){

  const next =
    Math.min(
      experiences.length - 1,
      Math.max(
        0,
        activeIndex + direction
      )
    );


  if(next !== activeIndex){

    activeIndex =
      next;

    renderPositions();

    hideHint();
  }
}


/* ==================================================
   SWIPE HINT
   ================================================== */

function hideHint(){

  if(hasInteracted){
    return;
  }


  hasInteracted =
    true;


  hint.style.opacity =
    "0";
}


/* ==================================================
   POINTER / SWIPE
   ================================================== */

function pointerDown(event){

  if(
    deepSheet.classList.contains(
      "open"
    )
  ){
    return;
  }


  dragging =
    true;


  startX =
    event.clientX
    ??
    event.touches?.[0]?.clientX
    ??
    0;


  deltaX =
    0;
}


function pointerMove(event){

  if(!dragging){
    return;
  }


  const x =
    event.clientX
    ??
    event.touches?.[0]?.clientX
    ??
    0;


  deltaX =
    x - startX;
}


function pointerUp(){

  if(!dragging){
    return;
  }


  dragging =
    false;


  if(deltaX < -52){

    move(1);

  }
  else if(deltaX > 52){

    move(-1);

  }


  window.setTimeout(
    ()=>{
      deltaX = 0;
    },
    0
  );
}


carousel.addEventListener(
  "pointerdown",
  pointerDown
);


window.addEventListener(
  "pointermove",
  pointerMove
);


window.addEventListener(
  "pointerup",
  pointerUp
);


/* ==================================================
   DEEP EXPERIENCE
   ================================================== */

function openDeep(index){

  const item =
    experiences[index];


  const titles = {

    session:
      "What today's session contained",

    learning:
      "What was strongest today",

    activity:
      "Inside the movement activity",

    personal:
      "The personal side of today's session",

    world:
      "A quieter part of today",

    home:
      "A little bridge back home"

  };


  sheetTitle.textContent =
    titles[item.type]
    ||
    "A little deeper";


  sheetCopy.textContent =
    item.deeper;


  learningList.innerHTML =
    item.learning
      .map(
        row => `
          <div class="learning-item">

            <div class="learning-symbol">
              ${row[0]}
            </div>

            <div>

              <div class="learning-name">
                ${row[1]}
              </div>

              <div class="learning-detail">
                ${row[2]}
              </div>

            </div>

          </div>
        `
      )
      .join("");


  wash.classList.add(
    "open"
  );


  deepSheet.classList.add(
    "open"
  );


  deepSheet.setAttribute(
    "aria-hidden",
    "false"
  );


  hideHint();
}


function closeDeep(){

  deepSheet.classList.remove(
    "open"
  );


  deepSheet.setAttribute(
    "aria-hidden",
    "true"
  );


  if(
    !navPanel.classList.contains(
      "open"
    )
  ){

    wash.classList.remove(
      "open"
    );
  }
}


sheetClose.addEventListener(
  "click",
  closeDeep
);


/* ==================================================
   NAVIGATION
   ================================================== */

navOrb.addEventListener(
  "click",
  ()=>{

    const opening =
      !navPanel.classList.contains(
        "open"
      );


    navPanel.classList.toggle(
      "open",
      opening
    );


    navOrb.classList.toggle(
      "open",
      opening
    );


    wash.classList.toggle(
      "open",
      opening
    );


    hideHint();
  }
);


wash.addEventListener(
  "click",
  ()=>{

    closeDeep();


    navPanel.classList.remove(
      "open"
    );


    navOrb.classList.remove(
      "open"
    );


    wash.classList.remove(
      "open"
    );
  }
);


document
  .querySelectorAll(
    ".nav-item"
  )
  .forEach(
    item=>{

      item.addEventListener(
        "click",
        ()=>{

          document
            .querySelectorAll(
              ".nav-item"
            )
            .forEach(
              navItem=>{

                navItem.classList.remove(
                  "active"
                );

              }
            );


          item.classList.add(
            "active"
          );


          if(
            typeof item.animate ===
            "function"
          ){

            item.animate(
              [
                {
                  transform:
                    "scale(.94)"
                },
                {
                  transform:
                    "scale(1.04)"
                },
                {
                  transform:
                    "scale(1)"
                }
              ],
              {
                duration:320,

                easing:
                  "cubic-bezier(.22,.75,.2,1)"
              }
            );

          }

        }
      );

    }
  );


/* ==================================================
   TIME OF DAY
   ================================================== */

function mixColor(
  a,
  b,
  amount
){

  const ah =
    a.replace(
      "#",
      ""
    );

  const bh =
    b.replace(
      "#",
      ""
    );


  const ar =
    parseInt(
      ah.slice(
        0,
        2
      ),
      16
    );

  const ag =
    parseInt(
      ah.slice(
        2,
        4
      ),
      16
    );

  const ab =
    parseInt(
      ah.slice(
        4,
        6
      ),
      16
    );


  const br =
    parseInt(
      bh.slice(
        0,
        2
      ),
      16
    );

  const bg =
    parseInt(
      bh.slice(
        2,
        4
      ),
      16
    );

  const bb =
    parseInt(
      bh.slice(
        4,
        6
      ),
      16
    );


  const r =
    Math.round(
      ar +
      (
        br - ar
      )
      *
      amount
    );


  const g =
    Math.round(
      ag +
      (
        bg - ag
      )
      *
      amount
    );


  const blue =
    Math.round(
      ab +
      (
        bb - ab
      )
      *
      amount
    );


  return `
    rgb(
      ${r}
      ${g}
      ${blue}
    )
  `;
}


/* ==================================================
   TIME PALETTES
   ================================================== */

function getPalette(hour){

  const palettes = {

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


  /*
    Morning
    through 11:00
  */

  if(hour < 11){

    from =
      palettes.morning;

    to =
      palettes.morning;

    amount =
      0;

  }


  /*
    Morning gently transitions
    toward afternoon
    from 11:00 to 14:00
  */

  else if(hour < 14){

    from =
      palettes.morning;

    to =
      palettes.afternoon;

    amount =
      (
        hour - 11
      )
      /
      3;

  }


  /*
    Afternoon
  */

  else if(hour < 17){

    from =
      palettes.afternoon;

    to =
      palettes.afternoon;

    amount =
      0;

  }


  /*
    Afternoon transitions
    toward evening
    from 17:00 to 20:00
  */

  else if(hour < 20){

    from =
      palettes.afternoon;

    to =
      palettes.evening;

    amount =
      (
        hour - 17
      )
      /
      3;

  }


  /*
    Evening
  */

  else{

    from =
      palettes.evening;

    to =
      palettes.evening;

    amount =
      0;

  }


  return from.map(
    (
      color,
      index
    )=>{

      return mixColor(
        color,
        to[index],
        amount
      );

    }
  );
}


/* ==================================================
   APPLY TIME ATMOSPHERE
   ================================================== */

function applyTimeAtmosphere(){

  const now =
    new Date();


  const hour =
    now.getHours()
    +
    now.getMinutes()
    /
    60;


  const palette =
    getPalette(
      hour
    );


  const root =
    document.documentElement;


  palette.forEach(
    (
      color,
      index
    )=>{

      root.style.setProperty(
        `--time-c${index + 1}`,
        color
      );

    }
  );


  let greeting =
    "Good evening, Mom";


  let message =
    "Come see a little of Mia's day.";


  if(hour < 12){

    greeting =
      "Good morning, Mom";


    message =
      "Mia's morning is waiting for you.";

  }


  else if(hour < 18){

    greeting =
      "Good afternoon, Mom";


    message =
      "A little of Mia's day is waiting for you.";

  }


  const timeGreeting =
    document.getElementById(
      "timeGreeting"
    );


  const timeMessage =
    document.getElementById(
      "timeMessage"
    );


  timeGreeting.textContent =
    greeting;


  timeMessage.textContent =
    message;
}


/* ==================================================
   ARRIVAL
   ================================================== */

let arrivalDone =
  false;


let arrivalTimer =
  null;


function syncArrivalCopy(){

  const greeting =
    document
      .getElementById(
        "timeGreeting"
      )
      ?.textContent
    ||
    "Good morning, Mom";


  const message =
    document
      .getElementById(
        "timeMessage"
      )
      ?.textContent
    ||
    "Mia's morning is waiting for you.";


  arrivalGreeting.textContent =
    greeting;


  arrivalMessage.textContent =
    message;
}


/* ==================================================
   ENTER APP
   ================================================== */

function enterParentWorld(){

  if(arrivalDone){
    return;
  }


  arrivalDone =
    true;


  if(arrivalTimer){

    clearTimeout(
      arrivalTimer
    );


    arrivalTimer =
      null;
  }


  appRoot.classList.add(
    "is-ready"
  );


  window.setTimeout(
    ()=>{

      arrivalScreen.setAttribute(
        "aria-hidden",
        "true"
      );

    },
    1200
  );
}


/* ==================================================
   START ARRIVAL TIMER
   ================================================== */

function beginArrival(){

  syncArrivalCopy();


  arrivalTimer =
    window.setTimeout(
      enterParentWorld,
      3200
    );


  arrivalScreen.addEventListener(
    "pointerup",
    enterParentWorld,
    {
      passive:true
    }
  );
}


/* ==================================================
   START APP
   ================================================== */

applyTimeAtmosphere();

buildCards();

beginArrival();
