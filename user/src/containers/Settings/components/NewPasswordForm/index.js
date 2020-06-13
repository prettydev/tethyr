import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button, { ButtonState } from '../../../../components/Button'
import './styles.css'

import imgClose from '../../../../assets/images/close_black.svg'
import imgDot from '../../../../assets/images/dot_gray.svg'
import { showNotificationMessage, NotificationColorMode } from '../../../../redux/actions/notificationMessage'
import { updatePassword } from '../../../../redux/actions/user'

class NewPasswordForm extends Component {

  constructor (props) {
    super(props)

    this.state = {
      password: '',
      confirmPassword: '',
      buttonState: ButtonState.normal,
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onSavePassword = (e) => {
    e.preventDefault()

    const { password, confirmPassword } = this.state

    if (password !== confirmPassword) {
      return this.props.dispatch(showNotificationMessage('Please confirm your new password', NotificationColorMode.red))
    }

    this.setState({
      buttonState: ButtonState.loading,
    })

    this.props.dispatch(updatePassword(this.props.user.user.token, password))

    setTimeout(() => {
      this.props.onClose()
    }, 1500)
  }

  onClose = () => {
    this.props.onClose()
  }

  render () {
    const { password, confirmPassword, buttonState } = this.state

    return (
      <div className='new-password-form'>
        <div className='header'>
          <span>Set New Password</span>
          <img className='clickable' src={imgClose} alt='close' onClick={this.onClose}/>
        </div>

        <form onSubmit={this.onSavePassword}>
          <div className='form-input'>
            <div>New Password</div>
            <input required name='password' type='password' value={password} onChange={this.onChange}/>
          </div>
          <div className='form-input'>
            <div>New Password (confirm)</div>
            <input required name='confirmPassword' type='password' value={confirmPassword} onChange={this.onChange}/>
          </div>

          <div className='form-instructions'>
            <div>We recommend choosing a password that:</div>
            <div><img src={imgDot} alt='dot'/>Is not being used by you already for another account / login</div>
            <div><img src={imgDot} alt='dot'/>Is at least 8 characters in length</div>
            <div><img src={imgDot} alt='dot'/>Uses uppercase and lowercase letters</div>
            <div><img src={imgDot} alt='dot'/>Uses at least one number (0-9) and special characters (!@#$%^* …)</div>
          </div>

          <Button state={buttonState}>Change my password</Button>
        </form>
      </div>
    )
  }
}

function mapStateToProps({ user }) {
  return {
    user,
  }
}

export default connect(mapStateToProps)(NewPasswordForm)
