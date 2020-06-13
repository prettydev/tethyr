import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import Button, { ButtonState } from '../../../../components/Button'
import GoogleButton from '../../../../components/GoogleButton'

import './styles.css'

import { loginUser, authenticateWithGoogle, signupUser } from '../../../../redux/actions/user'

export const AuthFormType = {
  login: 0,
  signup: 1,
}

class AuthForm extends Component {

  constructor (props) {
    super (props)

    this.state = {
      email: '',
      password: '',
      rememberMe: true,
      firstName: '',
      lastName: '',
      userName: '',
      loginUserName: '',
      buttonState: ButtonState.normal,
      formType: props.formType,
      loggingIn: false,
    }
  }

  componentDidUpdate (prevProps) {
    if(this.state.loggingIn !== this.props.user.loggingIn) {
      if(this.props.user.loggedIn) {
        if(this.props.user.user.status === 'Active') {
          this.props.history.push('/')
        }
        else if(this.props.user.user.status === 'Unconfirmed'){
          this.props.history.push('/tour')
        }
        else {
          this.props.history.push('/')
        }
      }
      else {
        if(!this.props.user.loggingIn && this.props.user.error) {
          this.setState({
            loggingIn: this.props.user.loggingIn,
            buttonState: ButtonState.normal,
          })
        }
        else {
          this.setState({
            loggingIn: this.props.user.loggingIn,
          })
        }
      }
    }
  }

  login = () => {
    this.setState({
      buttonState: ButtonState.loading,
    })

    this.props.dispatch(loginUser(this.state.loginUserName, this.state.password, this.state.rememberMe))
  }

  signup = () => {
    this.setState({
      buttonState: ButtonState.loading,
    })

    this.props.dispatch(signupUser({
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      userName: this.state.userName,
      email: this.state.email,
      password: this.state.password,
    }))
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onContinue = (e) => {
    e.preventDefault()

    if (this.state.formType === AuthFormType.login) {
      this.login()
    } else {
      this.signup()
    }
  }

  onGoogleAuthenticated = (user) => {
    this.props.dispatch(authenticateWithGoogle({
      ...user
    }))
  }

  onToggleMode = (formType) => {
    if(formType === 0) {
      this.props.history.push('/auth/login')
    }
    else {
      this.props.history.push('/auth/signup')
    }
  }

  toMainPage = () => {
    this.props.history.push('/')
  }

  render () {
    const { firstName, lastName, userName, loginUserName, email, password, buttonState, formType } = this.state
    const { user } = this.props;
    return (
      <div className='auth'>
        {
          user.loggedIn && 
          <div className={classNames('auth-form', {'logged': user.loggedIn})}>
            <div className='auth-form-header'>
              <div className='auth-form-title'>You are already logged in!</div>
              <div className='auth-form-redirect'>
                <div>Please go to the <span className='clickable' onClick={this.toMainPage}>main page!</span></div>
              </div>
            </div>
          </div>
        }
        { !user.loggedIn &&
          <div className={classNames('auth-form', {'signup-form': formType === AuthFormType.signup})}>
            {/* Form header */}
            <div className='auth-form-header'>
              <div className='auth-form-title'>
              { formType === AuthFormType.login ? 'Log In' : 'Sign Up' }
              </div>
              <div className='auth-form-redirect'>
              {
                formType === AuthFormType.login ?
                <div>New to Tethyr? <span className='clickable' onClick={() => this.onToggleMode(AuthFormType.signup)}>Sign Up</span></div>
                :
                <div>Already have an account? <span className='clickable' onClick={() => this.onToggleMode(AuthFormType.login)}>Log In</span></div>
              }
              </div>
              <GoogleButton onAuthenticated={this.onGoogleAuthenticated} />
            </div>

            {/* Separator */}
            <div className='auth-form-separator'>
              <div/><span>OR</span><div/>
            </div>

            {/* Form fields */}
            <form className='auth-form-inputs' autoComplete='off' onSubmit={this.onContinue}>
              <div className={classNames('auth-form-double-input', {'invisible': formType === AuthFormType.login})}>
                <div className='auth-form-input'>
                  <div className='auth-form-input-name'>First name</div>
                  <input required={formType === AuthFormType.signup} pattern="[^\s]+" type='text' name='firstName' value={firstName} onChange={this.onChange}/>
                </div>
                <div className='auth-form-input'>
                  <div className='auth-form-input-name'>Last name</div>
                  <input required={formType === AuthFormType.signup} pattern="[^\s]+" type='text' name='lastName' value={lastName} onChange={this.onChange}/>
                </div>
              </div>

              <div className={classNames('auth-form-input', {'invisible': formType === AuthFormType.login})}>
                <div className='auth-form-input-name'>Username</div>
                <input required={formType === AuthFormType.signup} pattern="[^\s]+" type='text' name='userName' value={userName} onChange={this.onChange}/>
              </div>

              <div className={classNames('auth-form-input', {'invisible': formType === AuthFormType.login})}>
                <div className='auth-form-input-name'>Email</div>
                <input required={formType === AuthFormType.signup} type='email' name='email' value={email} onChange={this.onChange}/>
              </div>

              <div className={classNames('auth-form-input', {'invisible': formType === AuthFormType.signup})}>
                <div className='auth-form-input-name'>UserName or Email</div>
                <input required={formType === AuthFormType.login} pattern="[^\s]+" type='text' name='loginUserName' value={loginUserName} onChange={this.onChange}/>
              </div>

              <div className='auth-form-input'>
                <div className='auth-form-input-name'>
                  <span>Password</span>
                  { formType === AuthFormType.login && <Link to='/auth/forgotpassword'>Forgot Password?</Link> }
                </div>
                <input required  type='password' name='password' value={password} onChange={this.onChange}/>
              </div>

              <div className={classNames('auth-form-footer', {'invisible': formType === AuthFormType.login})}>
                By clicking Sign In, or Sign up with Google, you agree to the <Link to='/terms'>Terms of Service</Link> and <Link to='/terms'>Privacy Policy</Link>.
              </div>

              <Button className='btn-continue' state={buttonState}>{ formType === AuthFormType.login ? 'Sign In' : 'Sign Up' }</Button>
            </form>
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default withRouter(connect(mapStateToProps)(AuthForm))
