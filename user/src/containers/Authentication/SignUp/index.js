import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import Button, { ButtonState } from '../../../components/Button'
import GoogleButton from '../../../components/GoogleButton'
import { authenticateWithGoogle, signupUser } from '../../../redux/actions/user'
import './styles.css'

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      userName: '',
      buttonState: ButtonState.normal,
    }
  }

  componentDidUpdate(prevProps)  {
    console.log(prevProps)
    if((prevProps.user.loggingIn !== this.props.user.loggingIn) && !this.props.user.loggingIn) {
      if(this.props.user.loggedIn) {
        this.props.history.push('/tour')
      }
      else {
        this.setState({
          buttonState: ButtonState.normal,
        })
      }
    }
  }

  onChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value,
    })
  }

  onToggleMode = () => {
    this.props.history.push('/auth/login')
  }

  toMainPage = () => {
    this.props.history.push('/')
  }

  onGoogleAuthenticated = (user) => {
    this.props.dispatch(authenticateWithGoogle({
      ...user
    }))
  }

  signup = (e) => {
    e.preventDefault()
    
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

  render() { 
    const { user } = this.props;
    const {
      firstName, 
      lastName,
      userName,
      email, 
      password,
      buttonState
    } = this.state;
    return (
      <div className='signup-container'>
      {/* Form */}
      <div className='div-signup-form'>
        <div className='container'>
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
            <div className={classNames('auth-form', 'signup-form')}>
              {/* Form header */}
              <div className='auth-form-header'>
                <div className='auth-form-title'>
                Sign Up
                </div>
                <div className='auth-form-redirect'>
                  <div>New to Tethyr?<span className='clickable' onClick={() => this.onToggleMode()}>Sign Up</span></div>
                </div>
                <GoogleButton onAuthenticated={this.onGoogleAuthenticated} />
              </div>

              {/* Separator */}
              <div className='auth-form-separator'>
                <div/><span>OR</span><div/>
              </div>

              {/* Form fields */}
              <form className='auth-form-inputs' autoComplete='off' onSubmit={this.signup}>
                <div className='auth-form-double-input'>
                  <div className='auth-form-input'>
                    <div className='auth-form-input-name'>First name</div>
                    <input required pattern="[^\s]+" type='text' name='firstName' value={firstName} onChange={this.onChange}/>
                  </div>
                  <div className='auth-form-input'>
                    <div className='auth-form-input-name'>Last name</div>
                    <input required pattern="[^\s]+" type='text' name='lastName' value={lastName} onChange={this.onChange}/>
                  </div>
                </div>

                <div className='auth-form-input'>
                  <div className='auth-form-input-name'>Username</div>
                  <input required pattern="[^\s]+" type='text' name='userName' value={userName} onChange={this.onChange}/>
                </div>

                <div className='auth-form-input'>
                  <div className='auth-form-input-name'>Email</div>
                  <input required type='email' name='email' value={email} onChange={this.onChange}/>
                </div>

                <div className='auth-form-input'>
                  <div className='auth-form-input-name'>
                    <span>Password</span>
                  </div>
                  <input required type='password' name='password' value={password} onChange={this.onChange}/>
                </div>

                <div className='auth-form-footer'>
                  By clicking Sign In, or Sign up with Google, you agree to the <Link to='/terms'>Terms of Service</Link> and <Link to='/terms'>Privacy Policy</Link>.
                </div>

                <Button className='btn-continue' state={buttonState}>Sign Up</Button>
              </form>
            </div>
          }
        </div>
        </div>
      </div>
    </div>
    );
  }
}

const mapStateToProps = ({user}) => {
  return {
    user
  };
}

export default connect(mapStateToProps)(Signup);