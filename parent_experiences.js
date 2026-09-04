import{
  getStudent,
  getFranchise,
  getCurrentSessionDetails,
  getSignedThumbnails
}from"./parent_data.js";

/*   experience photos*/
const fallbackPhotos=[
  "https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=1200&q=86",
  "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&w=1200&q=86",
  "https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=1200&q=86",
  "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=1200&q=86",
  "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1200&q=86",
  "https://images.unsplash.com/photo-1607453998774-d533f65dac99?auto=format&fit=crop&w=1200&q=86"
];

function getExperiencePhoto(thumbnails,index){
  const livePhotos=
    thumbnails.filter(Boolean);

  if(livePhotos.length){
    return livePhotos[
      index%
      livePhotos.length
    ];
  }

  return fallbackPhotos[index];
}

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

  const sessionLabel=
    currentSession
      ?`Session ${currentSession}`
      :"today's session";

  const lessonOne=
    session?.lesson_1_title||
    "";

  const lessonTwo=
    session?.lesson_2_title||
    "";

  const manner=
    session?.manner_topic||
    "";

  const sessionCategories=[
    lessonOne,
    lessonTwo,
    manner
  ].filter(Boolean);

  return[
    {
      type:"session",
      experience_type_code:"today_story",
      title:
        currentSession
          ?`${studentName} is exploring Session ${currentSession}.`
          :`${studentName}'s day at The Little Nest.`,
      label:"Today at The Little Nest",
      copy:
        session?.session_description||
        `A little look at what was woven into ${studentName}'s day.`,
      photo:getExperiencePhoto(thumbnails,0),
      categories:sessionCategories,
      deeper:
        session?.full_lesson_plan||
        "",
      learning:[
        ["🔤",lessonOne,session?.obj_text_1||""],
        ["🔢",lessonTwo,session?.obj_text_2||""],
        ["🌿",manner,session?.obj_text_3||""]
      ].filter(item=>item[1])
    },
    {
      type:"learning",
      experience_type_code:"learning_discovery",
      title:"Little hands had a lot to do.",
      label:"Learning Discovery",
      copy:
        `${studentName}'s ${sessionLabel} included hands-on chances to practice control, coordination and growing independence.`,
      photo:getExperiencePhoto(thumbnails,1),
      categories:[
        "Careful hand movements",
        "Growing independence",
        "Learning by doing"
      ],
      deeper:
        `${sessionLabel} gives us a learning thread we can turn into a simple parent-facing discovery without claiming how ${studentName} personally performed.`,
      learning:[
        ["🤲","Careful hand movements","Hands-on activities can support grip, control and coordinated movement."],
        ["🌱","Growing independence","The session creates opportunities to participate and do more independently."],
        ["✨","Learning by doing","The experience is built around active participation rather than only watching."]
      ]
    },
    {
      type:"activity",
      experience_type_code:"activity",
      title:"Learning through doing.",
      label:"Activity",
      copy:
        `${sessionLabel} gave ${studentName} opportunities to move, participate and connect learning with action.`,
      photo:getExperiencePhoto(thumbnails,2),
      categories:[
        "Movement",
        "Participation",
        "Learning by doing"
      ],
      deeper:
        `This card gives the parent one concrete piece of ${sessionLabel}: something ${studentName} had the opportunity to do as part of the session.`,
      learning:[
        ["🏃","Movement","Physical movement can be part of the learning experience."],
        ["💬","Participation","The session creates chances to join in and respond."],
        ["👂","Listening","Listening and responding support the activity as it unfolds."]
      ]
    },
    {
      type:"personal",
      experience_type_code:"growth",
      title:`There was room for ${studentName} to be ${studentName}.`,
      label:"Growth",
      copy:
        `${sessionLabel} created opportunities for participation, expression and growing independence.`,
      photo:getExperiencePhoto(thumbnails,3),
      categories:[
        "Growing independence",
        "Finding their voice",
        "Listening"
      ],
      deeper:
        `This is the personal-growth layer of the experience. Later, teacher observations and progress data can make this much more specific to ${studentName}.`,
      learning:[
        ["🌿","Growing independence","Opportunities to participate and make choices support growing independence."],
        ["💬","Finding their voice","Speaking, responding and expressing ideas can be part of the experience."],
        ["👂","Listening and understanding","Listening and responding remain an important supporting skill."]
      ]
    },
    {
      type:"world",
      experience_type_code:"my_world",
      title:"A little more of the world to discover.",
      label:"My World",
      copy:
        `${studentName}'s ${sessionLabel} also carried a quieter thread of discovery beyond the main lesson.`,
      photo:getExperiencePhoto(thumbnails,4),
      categories:[
        "Exploring the world",
        "Everyday discovery"
      ],
      deeper:
        `This card gives quieter discovery topics a place in the journey without forcing them to become the main story.`,
      learning:[
        ["🌎","Exploring the world","Everyday objects, people and surroundings can become part of the learning experience."],
        ["✨","A quieter discovery thread","This layer can stay gentle when another experience deserves more attention."]
      ]
    },
    {
      type:"home",
      experience_type_code:"together",
      title:"One tiny bridge back home.",
      label:"Together",
      copy:
        `A simple way to keep a little of ${studentName}'s Little Nest experience going at home.`,
      photo:getExperiencePhoto(thumbnails,5),
      categories:[
        "Talk about the day",
        "Keep it playful"
      ],
      deeper:
        `Together is the gentle home connection. It should feel like a continuation of ${studentName}'s day, never homework.`,
      learning:[
        ["🏡","Bring a little of the day home","A simple conversation, game or tiny activity can continue the connection."],
        ["💛","Keep it light","The experience should stay playful and optional."],
        ["→","Something to share","Later this can come directly from the session, teacher note or another live experience source."]
      ]
    }
  ];
}
