import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import Button, { ButtonState } from '../../../../components/Button'

import './styles.css'
import { forgotPassword } from '../../../../services/resetPassword';
import { showNotificationMessage, NotificationColorMode } from '../../../../redux/actions/notificationMessage';

class ForgotPasswordForm extends Component {

  constructor (props) {
    super(props)

    this.state = {
      email: '',
      resetRequested: false,
      buttonState: ButtonState.normal,
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onBack = () => {
    this.setState({
      resetRequested: false,
    })
  }

  onSubmit = (e) => {
    e.preventDefault()

    this.setState({
      buttonState: ButtonState.loading,
    })

    forgotPassword(this.state.email)
      .then(res => {
        this.setState({
          resetRequested: true,
          buttonState: ButtonState.normal,
        })
      })
      .catch(err => {
        this.setState({
          buttonState: ButtonState.normal,
        })

        this.props.dispatch(showNotificationMessage(err, NotificationColorMode.red))
      })
    }

  render () {
    const { resetRequested, buttonState } = this.state

    return (
      <div className='forgot-password-form'>
        {/* Form header */}
        <div className='header'>
          <div className='title'>
            { resetRequested ? 'Password Reset' : 'Forgot Your Password?' }
          </div>
          <div className={classNames('subtitle', {'bold': resetRequested})}>
            { 
              resetRequested ? 
              'An email has been sent with your instructions on how to reset your password. Please follow the provided instructions to reset your account.'
              :
              `Enter the email address associated with your account, and we'll email you a link to reset your password.`
            }
          </div>
        </div>

        {/* Form fields */}
        <div className='form-inputs'>
          { 
            !resetRequested &&
            <div className='input'>
              <input required type='email' name='email' value={this.state.email} onChange={this.onChange} placeholder='Enter your email address' />
            </div>
          }

          <div className='form-links'>
            <Button state={buttonState} onClick={resetRequested ? this.onBack : this.onSubmit}>{ resetRequested ? 'Back' : 'Reset Password' }</Button>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(ForgotPasswordForm)
