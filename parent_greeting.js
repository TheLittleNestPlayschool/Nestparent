import{
  getParent,
  getStudent
}from"./parent_data.js";

/*   apply parent greeting*/
export function applyParentGreeting(){
  const parent=
    getParent();

  const student=
    getStudent();

  if(
    !parent||
    !student
  ){
    return;
  }

  const now=
    new Date();

  const hour=
    now.getHours()+
    now.getMinutes()/60;

  const parentName=
    parent.first_name||
    parent.full_name||
    "Mom";

  const studentName=
    student.preferred_name||
    student.name||
    "your little one";

  let greeting=
    `Good evening ${parentName}`;

  let message=
    `Come see a little of ${studentName}'s day.`;

  if(hour<12){
    greeting=
      `Good morning ${parentName}`;

    message=
      `${studentName}'s morning is waiting for you.`;

  }else if(hour<18){
    greeting=
      `Good afternoon ${parentName}`;

    message=
      `A little of ${studentName}'s day is waiting for you.`;
  }

  const timeGreeting=
    document.getElementById(
      "timeGreeting"
    );

  const timeMessage=
    document.getElementById(
      "timeMessage"
    );

  if(timeGreeting){
    timeGreeting.textContent=
      greeting;
  }

  if(timeMessage){
    timeMessage.textContent=
      message;
  }
}
