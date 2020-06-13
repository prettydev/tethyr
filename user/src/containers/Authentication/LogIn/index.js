import React from 'react'
import AuthForm, { AuthFormType } from '../components/AuthForm'

import './styles.css'

const Login = (props) => {
  return (
    <div className='login-container'>
      {/* Form */}
      <div className='div-login-form'>
        <div className='container'>
          <AuthForm formType={AuthFormType.login}/>
        </div>
      </div>
    </div>
  )
}

export default Login
