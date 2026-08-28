const XANO_BASE_URL='https://x8ki-letl-twmt.n7.xano.io/api:wtEDiEuV';

/*   activate*/
export function activateParentAuth(startApp){
  const login=document.getElementById('parentLogin');
  const experience=document.getElementById('parentExperience');
  const email=document.getElementById('loginEmail');
  const password=document.getElementById('loginPassword');
  const button=document.getElementById('loginButton');
  const error=document.getElementById('loginError');

  login.classList.add('is-visible');

  async function submit(){
    error.textContent='';
    error.classList.remove('is-visible');

    if(!email.value.trim()||!password.value){
      error.textContent='Please enter your email and password.';
      error.classList.add('is-visible');
      return;
    }

    button.disabled=true;

    try{
      const response=await fetch(`${XANO_BASE_URL}/auth/login`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          email:email.value.trim(),
          password:password.value
        })
      });

      const data=await response.json();

      if(!response.ok){
        throw new Error(
          data.message||
          'Invalid email or password.'
        );
      }

      localStorage.setItem(
        'authToken',
        data.authToken
      );

      login.classList.remove('is-visible');
      experience.classList.add('is-visible');

      startApp();

    }catch(err){
      error.textContent=err.message;
      error.classList.add('is-visible');
      button.disabled=false;
    }
  }

  button.addEventListener(
    'click',
    submit
  );

  password.addEventListener(
    'keydown',
    event=>{
      if(event.key==='Enter'){
        submit();
      }
    }
  );
}
