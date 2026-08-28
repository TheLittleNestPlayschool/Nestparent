import{
  getStudent,
  getFranchise,
  getCurrentSessionDetails,
  getSignedThumbnails
}from"./parent_data.js";

/*   build experiences*/
export function getExperiences(){
  const student=getStudent();
  const franchise=getFranchise();
  const session=getCurrentSessionDetails();
  const thumbnails=getSignedThumbnails();

  const studentName=
    student?.preferred_name||
    student?.name||
    "Your little one";

  const currentSession=
    franchise?.current_session||
    session?.session_num||
    "";

  const photo=
    thumbnails[0]||
    "https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=1200&q=86";

  const lessonOne=
    session?.lesson_1_title||
    "";

  const lessonTwo=
    session?.lesson_2_title||
    "";

  const manner=
    session?.manner_topic||
    "";

  const categories=[
    lessonOne,
    lessonTwo,
    manner
  ].filter(Boolean);

  return [
    {
      type:"session",

      title:
        `${studentName} is exploring Session ${currentSession}.`,

      label:
        "Today at The Little Nest",

      copy:
        session?.session_description||
        "A little look at today's learning at The Little Nest.",

      photo,

      categories,

      deeper:
        session?.full_lesson_plan||
        "",

      learning:[
        [
          "🔤",
          lessonOne,
          session?.obj_text_1||""
        ],
        [
          "🔢",
          lessonTwo,
          session?.obj_text_2||""
        ],
        [
          "🌿",
          manner,
          session?.obj_text_3||""
        ]
      ].filter(item=>item[1])
    },

    {
      type:"learning",

      title:
        "Little hands had a lot to do.",

      label:
        "A big part of today's learning",

      copy:
        "Today's activities gave Mia opportunities to practice grip, control and careful hand movements.",

      photo:
        "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&w=1200&q=86",

      categories:[
        "Careful hand movements",
        "Growing independence",
        "Moving while learning"
      ],

      deeper:
        "Fine motor development is one of the strongest ingredients in Session 1. The weighting stays behind the scenes and simply helps the Stage Engine decide what deserves more attention.",

      learning:[
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
      type:"activity",

      title:
        "Learning through movement.",

      label:
        "One part of today's session",

      copy:
        "The Name Movement Game gives children a chance to move, participate and connect their bodies with the group experience.",

      photo:
        "https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=1200&q=86",

      categories:[
        "Name Movement Game",
        "Movement",
        "Participation"
      ],

      deeper:
        "The physical activity field gives us something concrete to show families even when no teacher note exists. We can explain what was built into the session without claiming exactly how Mia personally performed.",

      learning:[
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
      type:"personal",

      title:
        "There was also room for Mia to be Mia.",

      label:
        "Growing through the session",

      copy:
        "Session 1 gives children strong opportunities to participate, express themselves and build independence.",

      photo:
        "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1200&q=86",

      categories:[
        "Growing independence",
        "Finding her voice",
        "Listening"
      ],

      deeper:
        "Session 1 is not only about letters and numbers. Personal development and oral language are both strongly represented, which tells us that participation, expression and interaction are central ingredients too.",

      learning:[
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
      type:"world",

      title:
        "A small piece of the world around her.",

      label:
        "Also woven into today",

      copy:
        "Session 1 includes a lighter layer of exploration beyond letters and numbers.",

      photo:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=86",

      categories:[
        "Exploring her world",
        "Everyday discovery"
      ],

      deeper:
        "The My World area has a lighter contribution in Session 1. It does not need to dominate the experience, but it can remain quietly present as part of the full session story.",

      learning:[
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
      type:"home",

      title:
        "One tiny bridge back home.",

      label:
        "Continue the connection",

      copy:
        "Session 1 includes a home-time activity called “Name That Friend.”",

      photo:
        "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=1200&q=86",

      categories:[
        "Name That Friend",
        "Optional at home"
      ],

      deeper:
        "The home-time activity gives us a natural way to continue the Little Nest experience without turning home into homework. It can appear only when the Stage Engine thinks it is useful.",

      learning:[
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
}
