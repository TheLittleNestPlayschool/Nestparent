const experiences = [
  {
    type: "sessionlklklklkl",
    title: "Mia just finished Session 1 ssssss.",
    label: "Today at The Little Nest",
    copy: "Letter A, Number 1, movement, listening and self-expression were all part of her morning.",
    photo: "https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=1200&q=86",
    categories: ["Letter A", "Number 1", "Movement"],
    deeper: "Session 1 introduces Letter A and Number 1 while weaving in movement, listening, speaking and personal development. This is curriculum truth: we know Mia attended this session and these were the learning opportunities built into it.",
    learning: [
      ["🔤", "Literacy · 1.0", "A core focus on early letter work, including uppercase Letter A."],
      ["🔢", "Numeracy · 0.2", "An early introduction to Number 1."],
      ["💬", "Oral Language · 1.0", "Active participation and speaking are strongly built into the session."],
      ["👂", "Receptive Language · 0.7", "Listening to instructions and following along are part of the session."]
    ]
  },
  {
    type: "learning",
    title: "Little hands had a lot to do sssssss.",
    label: "Strongest learning ingredient",
    copy: "Fine motor development carries one of the strongest weights in Session 1.",
    photo: "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&w=1200&q=86",
    categories: ["Fine Motor · 1.0", "Personal · 0.9", "Gross Motor · 0.8"],
    deeper: "The Stage Engine can use the Session 1 category weights to decide what deserves the most attention. The parent does not need to see a scorecard; the weights simply help us understand the shape of the session.",
    learning: [
      ["🤲", "Fine Motor · 1.0", "Pencil grip and controlled hand movement are strongly emphasized."],
      ["🌱", "Personal · 0.9", "Session 1 places heavy emphasis on self and personal development."],
      ["🏃", "Gross Motor · 0.8", "Physical movement games are a significant part of the session."],
      ["🎨", "Creative Arts · 0.4", "Expressive movement is present, but it is a quieter part of today's learning mix."]
    ]
  },
  {
    type: "activity",
    title: "Learning through movement ssssss.",
    label: "One part of Session 1",
    copy: "The Name Movement Game gives children a chance to move, participate and connect their bodies with the group experience.",
    photo: "https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=1200&q=86",
    categories: ["Name Movement Game", "Gross Motor", "Participation"],
    deeper: "The physical-activity field gives us something concrete to show families even when no teacher note exists. We can explain what was built into the session without claiming exactly how Mia personally performed.",
    learning: [
      ["🏃", "Movement", "The planned activity uses physical movement as part of learning."],
      ["💬", "Participation", "The session encourages active participation rather than passive watching."],
      ["👂", "Listening", "Children need to listen and respond as the group activity unfolds."]
    ]
  },
  {
    type: "personal",
    title: "There was also room for Mia to be Mia sssssss.",
    label: "Personal development",
    copy: "Session 1 gives strong weight to self-expression, participation and personal awareness.",
    photo: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1200&q=86",
    categories: ["Personal · 0.9", "Oral Language · 1.0"],
    deeper: "Session 1 does not focus only on letters and numbers. The personal-development weight is 0.9 and oral-language weight is 1.0, which tells us that participation, expression and interaction are central ingredients too.",
    learning: [
      ["🌿", "Personal · 0.9", "A strong emphasis on self and participation is built into the session."],
      ["💬", "Oral Language · 1.0", "Speaking and active verbal participation are major parts of the experience."],
      ["👂", "Receptive Language · 0.7", "Listening and responding remain an important supporting skill."]
    ]
  },
  {
    type: "world",
    title: "A small piece of her world sssssss.",
    label: "My World",
    copy: "Session 1 also includes exploration beyond letters and numbers, with a lighter My World contribution.",
    photo: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=86",
    categories: ["My World · 0.4", "Exploration"],
    deeper: "The My World category carries a lighter weight in Session 1. It does not need to dominate the screen, but it can remain in the periphery as part of the full session story.",
    learning: [
      ["🌎", "My World · 0.4", "Exploring everyday objects and the child's surrounding world is present in the session."],
      ["✨", "Peripheral learning", "Because its weight is lower, the Stage Engine can keep it quieter than literacy, oral language or fine motor."]
    ]
  },
  {
    type: "home",
    title: "One tiny bridge back home.",
    label: "Home connection",
    copy: "Session 1 includes a home-time activity called “Name That Friend.”",
    photo: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=1200&q=86",
    categories: ["Name That Friend", "Optional at home"],
    deeper: "The home-time activity gives us a natural way to continue the Little Nest experience without turning home into homework. It can appear only when the Stage Engine thinks it is useful.",
    learning: [
      ["🏡", "Name That Friend", "A simple home connection drawn directly from Session 1."],
      ["💛", "Keep it light", "This should feel like a little continuation of the child's day, never an assignment."],
      ["→", "What comes next", "The session table also gives us a next-description field that can later support a gentle preview of the next session."]
    ]
  }
];

const carousel = document.getElementById("carousel");
const hint = document.getElementById("hint");
const deepSheet = document.getElementById("deepSheet");
const sheetTitle = document.getElementById("sheetTitle");
const sheetCopy = document.getElementById("sheetCopy");
const learningList = document.getElementById("learningList");
const sheetClose = document.getElementById("sheetClose");
const wash = document.getElementById("wash");
const navOrb = document.getElementById("navOrb");
const navPanel = document.getElementById("navPanel");

let activeIndex = 0;
let startX = 0;
let deltaX = 0;
let dragging = false;
let hasInteracted = false;

function buildCards() {
  experiences.forEach((item, index) => {
    const article = document.createElement("article");

    article.className = "experience";
    article.dataset.index = index;

    article.innerHTML = `
      <div class="card">

        <div
          class="photo"
          style="background-image:url('${item.photo}')">
        </div>

        <div class="type-mark">
          ${
            ({
              session: "Session 1",
              learning: "Learning",
              activity: "Activity",
              personal: "Growth",
              world: "My World",
              home: "Home"
            })[item.type] || "Story"
          }
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
            ${item.categories
              .map(category => {
                return `
                  <span class="learn-pill">
                    ${category}
                  </span>
                `;
              })
              .join("")}
          </div>

        </div>

      </div>
    `;

    article.addEventListener("click", () => {
      if (
        Math.abs(deltaX) < 8 &&
        Number(article.dataset.index) === activeIndex
      ) {
        openDeep(activeIndex);
      }
    });

    carousel.appendChild(article);
  });

  renderPositions();
}

function renderPositions() {
  const cards = [
    ...document.querySelectorAll(".experience")
  ];

  cards.forEach((card, index) => {
    const offset = index - activeIndex;

    if (offset < -2 || offset > 2) {
      card.style.opacity = "0";
      card.style.pointerEvents = "none";

      card.style.transform = `
        translate(-50%, -50%)
        translateX(${offset * 64}%)
        scale(.74)
      `;

      card.style.filter = "blur(9px)";
      card.dataset.pos = offset;

      return;
    }

    const x = offset * 73;
    const scale = offset === 0 ? 1 : 0.86;
    const rotate = offset * -2.6;
    const z = offset === 0 ? 0 : -90;
    const y = Math.abs(offset) * 10;
    const opacity = offset === 0 ? 1 : 0.46;

    card.style.opacity = opacity;

    card.style.pointerEvents =
      offset === 0
        ? "auto"
        : "none";

    card.style.filter =
      offset === 0
        ? "blur(0px)"
        : "blur(1.4px)";

    card.style.transform = `
      translate(-50%, -50%)
      translate3d(${x}%, ${y}px, ${z}px)
      rotate(${rotate}deg)
      scale(${scale})
    `;

    card.style.zIndex =
      10 - Math.abs(offset);

    card.dataset.pos = offset;
  });
}

function move(direction) {
  const next = Math.min(
    experiences.length - 1,
    Math.max(
      0,
      activeIndex + direction
    )
  );

  if (next !== activeIndex) {
    activeIndex = next;

    renderPositions();
    hideHint();
  }
}

function hideHint() {
  if (hasInteracted) {
    return;
  }

  hasInteracted = true;

  hint.style.opacity = "0";
}

function pointerDown(event) {
  if (deepSheet.classList.contains("open")) {
    return;
  }

  dragging = true;

  startX =
    event.clientX ??
    event.touches?.[0]?.clientX ??
    0;

  deltaX = 0;
}

function pointerMove(event) {
  if (!dragging) {
    return;
  }

  const x =
    event.clientX ??
    event.touches?.[0]?.clientX ??
    0;

  deltaX = x - startX;
}

function pointerUp() {
  if (!dragging) {
    return;
  }

  dragging = false;

  if (deltaX < -52) {
    move(1);
  } else if (deltaX > 52) {
    move(-1);
  }

  setTimeout(() => {
    deltaX = 0;
  }, 0);
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

function openDeep(index) {
  const item = experiences[index];

  const titles = {
    session: "What Session 1 contained",
    learning: "What was strongest today",
    activity: "Inside the movement activity",
    personal: "The personal side of Session 1",
    world: "A quieter part of today",
    home: "A little bridge back home"
  };

  sheetTitle.textContent =
    titles[item.type] ||
    "A little deeper";

  sheetCopy.textContent =
    item.deeper;

  learningList.innerHTML =
    item.learning
      .map(row => {
        return `
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
        `;
      })
      .join("");

  wash.classList.add("open");
  deepSheet.classList.add("open");

  deepSheet.setAttribute(
    "aria-hidden",
    "false"
  );

  hideHint();
}

function closeDeep() {
  deepSheet.classList.remove("open");

  deepSheet.setAttribute(
    "aria-hidden",
    "true"
  );

  if (
    !navPanel.classList.contains("open")
  ) {
    wash.classList.remove("open");
  }
}

sheetClose.addEventListener(
  "click",
  closeDeep
);

navOrb.addEventListener(
  "click",
  () => {
    const opening =
      !navPanel.classList.contains("open");

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
  () => {
    closeDeep();

    navPanel.classList.remove("open");
    navOrb.classList.remove("open");
    wash.classList.remove("open");
  }
);

document
  .querySelectorAll(".nav-item")
  .forEach(item => {

    item.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".nav-item")
          .forEach(navItem => {
            navItem.classList.remove(
              "active"
            );
          });

        item.classList.add("active");

        item.animate(
          [
            {
              transform: "scale(.94)"
            },
            {
              transform: "scale(1.04)"
            },
            {
              transform: "scale(1)"
            }
          ],
          {
            duration: 320,
            easing:
              "cubic-bezier(.22,.75,.2,1)"
          }
        );
      }
    );
  });


/* ==============================================
   TIME OF DAY ATMOSPHERE
   ============================================== */

function mixColor(a, b, t) {
  const ah = a.replace("#", "");
  const bh = b.replace("#", "");

  const ar =
    parseInt(ah.slice(0, 2), 16);

  const ag =
    parseInt(ah.slice(2, 4), 16);

  const ab =
    parseInt(ah.slice(4, 6), 16);

  const br =
    parseInt(bh.slice(0, 2), 16);

  const bg =
    parseInt(bh.slice(2, 4), 16);

  const bb =
    parseInt(bh.slice(4, 6), 16);

  const r =
    Math.round(
      ar + (br - ar) * t
    );

  const g =
    Math.round(
      ag + (bg - ag) * t
    );

  const blue =
    Math.round(
      ab + (bb - ab) * t
    );

  return `
    rgb(${r} ${g} ${blue})
  `;
}

function getPalette(hour) {
  const palettes = {
    morning: [
      "#fff7dc",
      "#f6e7c9",
      "#e7efe0",
      "#fffaf1"
    ],

    afternoon: [
      "#e4efe4",
      "#d2e2d7",
      "#f5ead3",
      "#edf4e8"
    ],

    evening: [
      "#d9e3ee",
      "#d8d4e8",
      "#ece6de",
      "#cfdce7"
    ]
  };

  let from;
  let to;
  let amount;

  if (hour < 11) {

    from = palettes.morning;
    to = palettes.morning;
    amount = 0;

  } else if (hour < 14) {

    from = palettes.morning;
    to = palettes.afternoon;
    amount =
      (hour - 11) / 3;

  } else if (hour < 17) {

    from = palettes.afternoon;
    to = palettes.afternoon;
    amount = 0;

  } else if (hour < 20) {

    from = palettes.afternoon;
    to = palettes.evening;
    amount =
      (hour - 17) / 3;

  } else {

    from = palettes.evening;
    to = palettes.evening;
    amount = 0;

  }

  return from.map(
    (color, index) => {
      return mixColor(
        color,
        to[index],
        amount
      );
    }
  );
}

function applyTimeAtmosphere() {
  const now = new Date();

  const hour =
    now.getHours() +
    now.getMinutes() / 60;

  const palette =
    getPalette(hour);

  const root =
    document.documentElement;

  palette.forEach(
    (color, index) => {

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

  if (hour < 12) {

    greeting =
      "Good morning, Mom";

    message =
      "Mia's morning is waiting for you.";

  } else if (hour < 18) {

    greeting =
      "Good afternoon, Mom";

    message =
      "A little of Mia's day is waiting for you.";
  }

  document
    .getElementById("timeGreeting")
    .textContent = greeting;

  document
    .getElementById("timeMessage")
    .textContent = message;
}

applyTimeAtmosphere();


/* ==============================================
   OPENING / ARRIVAL EXPERIENCE
   ============================================== */

const appRoot =
  document.getElementById("app");

let arrivalDone = false;
let arrivalTimer = null;

function enterParentWorld() {

  if (arrivalDone) {
    return;
  }

  arrivalDone = true;

  if (arrivalTimer) {
    clearTimeout(arrivalTimer);
    arrivalTimer = null;
  }

  appRoot.classList.add(
    "entering"
  );

  requestAnimationFrame(() => {

    requestAnimationFrame(() => {

      appRoot.classList.remove(
        "arrival"
      );

      appRoot.classList.add(
        "ready"
      );

    });

  });

  window.setTimeout(() => {

    appRoot.classList.remove(
      "entering"
    );

  }, 1400);
}

function beginArrival() {

  arrivalTimer =
    window.setTimeout(
      enterParentWorld,
      3200
    );

  appRoot.addEventListener(
    "pointerup",
    event => {

      if (arrivalDone) {
        return;
      }

      const target =
        event.target;

      if (
        target.closest("button")
      ) {
        return;
      }

      enterParentWorld();

    },
    {
      passive: true
    }
  );
}

beginArrival();


/* ==============================================
   START
   ============================================== */

buildCards();
