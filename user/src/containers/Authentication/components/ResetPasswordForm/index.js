import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Button, { ButtonState } from '../../../../components/Button'

import './styles.css'
import { showNotificationMessage, NotificationColorMode } from '../../../../redux/actions/notificationMessage';
import { resetPassword } from '../../../../services/resetPassword';

class ResetPasswordForm extends Component {

  constructor (props) {
    super(props)

    this.state = {
      newPassword: '',
      confirmNewPassword: '',
      buttonState: ButtonState.normal,
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onSubmit = (e) => {
    e.preventDefault()

    const { newPassword, confirmNewPassword } = this.state
    const unique_id = this.props.match.params.unique_id
    const token = this.props.match.params.token

    if (newPassword !== confirmNewPassword) {
      return this.props.dispatch(showNotificationMessage('Please confirm new password again.', NotificationColorMode.red))
    }
    
    if (!token) {
      return this.props.dispatch(showNotificationMessage('Reset token is missing.', NotificationColorMode.red))
    }

    this.setState({
      buttonState: ButtonState.loading,
    })

    resetPassword(unique_id, token, newPassword)
      .then(res => {
        this.setState({
          buttonState: ButtonState.normal,
        })

        this.props.history.push('/auth/login')
        this.props.dispatch(showNotificationMessage('Your password has been reset.', NotificationColorMode.green))
      })
      .catch(err => {
        this.setState({
          buttonState: ButtonState.normal,
        })

        this.props.dispatch(showNotificationMessage('Failed to reset password.', NotificationColorMode.red))
      })
  }

  render () {
    return (
      <div className='reset-password-form'>
        {/* Form header */}
        <div className='header'>
          <div className='title'>
            Change your password
          </div>
          <div className='subtitle'>
            Enter a new password. Changing your password will sign you out of all your devices, including your phone. You will need to enter your new password on all your devices.
          </div>
        </div>

        {/* Form fields */}
        <div className='form-inputs'>
          <div className='input'>
            <span>New Password</span>
            <input required type='password' name='newPassword' value={this.state.newPassword} onChange={this.onChange}/>
          </div>

          <div className='input'>
            <span>Confirm New Password</span>
            <input required type='password' name='confirmNewPassword' value={this.state.confirmNewPassword} onChange={this.onChange}/>
          </div>

          <div className='form-links'>
            <Button state={this.state.buttonState} onClick={this.onSubmit}>Change Password</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(withRouter(ResetPasswordForm))
