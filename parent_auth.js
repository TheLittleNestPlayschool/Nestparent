const XANO_BASE_URL='https://x58r-xped-p4y6.n7e.xano.io/api:wtEDiEuV';

/*   wait for login exit*/
function waitForLoginExit(login){
  return new Promise(resolve=>{
    let done=false;

    const finish=()=>{
      if(done)return;
      done=true;
      login.removeEventListener('transitionend',handleEnd);
      resolve();
    };

    const handleEnd=event=>{
      if(event.target===login&&event.propertyName==='opacity')finish();
    };

    login.addEventListener('transitionend',handleEnd);
    window.setTimeout(finish,900);
  });
}

/*   activate*/
export function activateParentAuth(startApp){
  const login=document.getElementById('parentLogin');
  const experience=document.getElementById('parentExperience');
  const email=document.getElementById('loginEmail');
  const password=document.getElementById('loginPassword');
  const button=document.getElementById('loginButton');
  const actionText=login?.querySelector('.parent-login-action-text');
  const error=document.getElementById('loginError');
  let submitting=false;

  login.classList.add('is-visible');

  /*   login progress*/
  function setLoading(loading){
    submitting=loading;
    email.disabled=loading;
    password.disabled=loading;
    button.disabled=loading;
    button.classList.toggle('is-loading',loading);
    login.classList.toggle('is-authenticating',loading);

    if(actionText){
      actionText.textContent=loading?'Opening your Nest…':'Enter The Nest';
    }

    button.innerHTML=loading
      ?'<span class="parent-login-spinner" aria-hidden="true"></span>'
      :'→';

    button.setAttribute(
      'aria-label',
      loading?'Opening your Nest':'Enter The Nest'
    );
  }

  async function submit(){
    if(submitting)return;

    error.textContent='';
    error.classList.remove('is-visible');

    if(!email.value.trim()||!password.value){
      error.textContent='Please enter your email and password.';
      error.classList.add('is-visible');
      return;
    }

    setLoading(true);

    try{
      const response=await fetch(`${XANO_BASE_URL}/auth/login`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          email:email.value.trim(),
          password:password.value
        })
      });

      const data=await response.json();

      if(!response.ok){
        throw new Error(data.message||'Invalid email or password.');
      }

      localStorage.setItem('authToken',data.authToken);

      /*   prepare personalized arrival behind login*/
      await startApp();

      /*   finish login exit before revealing arrival*/
      login.classList.remove('is-visible');
      await waitForLoginExit(login);
      experience.classList.add('is-visible');
    }catch(err){
      error.textContent=err.message||'We couldn’t sign you in. Please check your email and password.';
      error.classList.add('is-visible');
      setLoading(false);
    }
  }

  button.addEventListener('click',submit);

  password.addEventListener('keydown',event=>{
    if(event.key==='Enter')submit();
  });
}
