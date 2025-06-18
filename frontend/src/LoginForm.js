import React, {useState} from 'react'

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className='container'>
      <div className='form-container'>
        <div className='form-toggle'>
          <button className={isLogin ? 'active' : ""} onClick={() => setIsLogin
            (true)}>Login</button>
          <button className={!isLogin ? 'actve' : ""} onClick={() => setIsLogin
            (false)}>SignUp</button>
        </div>
        {isLogin ? <>
        <div className='form'>
          <h2>Login Form</h2>
          <input type= 'email' placeholder= 'Email'/>
          <input type= 'password' placeholder= 'Password'/>
          <a href= '#'>Forgot Password?</a>
          <button>Login</button>
          <p>Not a Member?<a href= '#'>Signup now</a></p>
          </div>
          </> : <>
          <div className= 'form'>
          <h2>SignupForm</h2>
              <input type='email' placeholder= 'Email'/>
              <input type='password' placeholder= 'Password'/>
              <input type= 'password' placeholder= 'Change Password'/>
              <button>SignUp</button>
              </div>
          </>}
        </div>
    </div> 
  );
}


