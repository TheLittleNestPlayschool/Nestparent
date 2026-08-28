const XANO_BASE_URL='https://x8ki-letl-twmt.n7.xano.io/api:wtEDiEuV';

/*   auth values*/
export function getAuthToken(){
  return localStorage.getItem('authToken')||'';
}

export function getParentId(){
  return localStorage.getItem('parent_id')||'';
}

export function isParentAuthenticated(){
  return Boolean(
    getAuthToken()&&
    getParentId()
  );
}

/*   clear auth*/
export function clearParentAuth(){
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('parent_id');
  localStorage.removeItem('admin_type_id');
}

/*   save auth*/
function saveParentAuth(data){
  clearParentAuth();

  localStorage.setItem(
    'authToken',
    data.authToken
  );

  if(data.user?.id){
    localStorage.setItem(
      'userId',
      data.user.id
    );
  }else if(data.user){
    localStorage.setItem(
      'userId',
      data.user
    );
  }

  localStorage.setItem(
    'parent_id',
    data.parent_id
  );

  if(data.admin_type_id){
    localStorage.setItem(
      'admin_type_id',
      data.admin_type_id
    );
  }
}

/*   login request*/
async function loginParent(email,password){
  const response=await fetch(
    `${XANO_BASE_URL}/auth/login`,
    {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        email,
        password
      })
    }
  );

  const data=await response.json();

  if(!response.ok){
    throw new Error(
      data.message||
      'Invalid email or password.'
    );
  }

  if(!data.authToken){
    throw new Error(
      'No authentication token was returned.'
    );
  }

  if(!data.parent_id){
    throw new Error(
      'This account is not connected to a parent.'
    );
  }

  saveParentAuth(data);

  return data;
}

/*   show login*/
function showLogin(){
  const login=document.getElementById('parentLogin');
  const app=document.getElementById('parentExperience');

  if(login){
    login.classList.add('is-visible');
  }

  if(app){
    app.classList.remove('is-visible');
  }
}

/*   show experience*/
function showExperience(){
  const login=document.getElementById('parentLogin');
  const app=document.getElementById('parentExperience');

  if(login){
    login.classList.add('is-leaving');
  }

  window.setTimeout(()=>{
    if(login){
      login.classList.remove('is-visible');
      login.classList.remove('is-leaving');
    }

    if(app){
      app.classList.add('is-visible');
    }
  },700);
}

/*   error*/
function showLoginError(message){
  const error=document.getElementById('loginError');

  if(!error) return;

  error.textContent=message;
  error.classList.add('is-visible');
}

/*   clear error*/
function clearLoginError(){
  const error=document.getElementById('loginError');

  if(!error) return;

  error.textContent='';
  error.classList.remove('is-visible');
}

/*   activate login*/
function activateLogin(onAuthenticated){
  const email=document.getElementById('loginEmail');
  const password=document.getElementById('loginPassword');
  const button=document.getElementById('loginButton');

  if(!email||!password||!button) return;

  const submit=async()=>{
    const emailValue=email.value.trim();
    const passwordValue=password.value;

    clearLoginError();

    if(!emailValue||!passwordValue){
      showLoginError(
        'Please enter your email and password.'
      );
      return;
    }

    button.disabled=true;
    button.classList.add('is-loading');

    try{
      const data=await loginParent(
        emailValue,
        passwordValue
      );

      showExperience();

      window.setTimeout(()=>{
        onAuthenticated(data);
      },700);

    }catch(error){
      showLoginError(error.message);
      button.disabled=false;
      button.classList.remove('is-loading');
    }
  };

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

/*   start auth*/
export function activateParentAuth(onAuthenticated){
  if(isParentAuthenticated()){
    const login=document.getElementById('parentLogin');
    const app=document.getElementById('parentExperience');

    if(login){
      login.classList.remove('is-visible');
    }

    if(app){
      app.classList.add('is-visible');
    }

    onAuthenticated();
    return;
  }

  showLogin();
  activateLogin(onAuthenticated);
}
