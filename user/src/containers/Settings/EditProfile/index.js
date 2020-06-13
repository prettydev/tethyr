import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { ButtonState } from '../../../components/Button'
import NewPasswordForm from '../components/NewPasswordForm'

import './styles.css'
import imgDot from '../../../assets/images/gray_dot.svg'
import imgClose from '../../../assets/images/close_black.svg'
//import imgRightArrow from '../../../assets/images/right_arrow_gray.svg'

import { updateUserProfile, updatePassword } from '../../../redux/actions/user'
import { showNotificationMessage, NotificationColorMode } from '../../../redux/actions/notificationMessage'

class EditProfile extends Component {

  constructor (props) {
    super(props)

    this.state = {
      firstName: props.user.user.firstName,
      lastName: props.user.user.lastName,
      userName: props.user.user.userName,
      email: props.user.user.email,
      password: '',
      confirmPassword: '',
      editingPassword: false,
      buttonState: ButtonState.normal,
      showNewPasswordForm: false,
    }
  }

  componentWillReceiveProps ({ user }) {
    console.log(user, this.props.user)
    if (JSON.stringify(user) !== JSON.stringify(this.props.user)) {
      
      this.setState({
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        userName: user.user.userName,
        email: user.user.email,
        buttonState: ButtonState.normal,
        password: '',
        confirmPassword: '',
      })

      this.props.dispatch(showNotificationMessage('Your account settings have been updated', NotificationColorMode.green))
    }
  }

  onSave = () => {
    const { firstName, lastName, userName, email, password, confirmPassword, editingPassword } = this.state

    if (editingPassword) {
      if (password !== confirmPassword) {
        return this.props.dispatch(showNotificationMessage('Please confirm your new password', NotificationColorMode.red))
      }
  
      if (!password || !confirmPassword.trim()) {
        return this.props.dispatch(showNotificationMessage('Please enter your new password', NotificationColorMode.red))
      }
    }

    if (!firstName.trim()) {
      return this.props.dispatch(showNotificationMessage('Please enter your first name', NotificationColorMode.red))
    }

    if (!lastName.trim()) {
      return this.props.dispatch(showNotificationMessage('Please enter your last name', NotificationColorMode.red))
    }

    if (!userName.trim()) {
      return this.props.dispatch(showNotificationMessage('Please enter your last name', NotificationColorMode.red))
    }

    if (!email.trim()) {
      return this.props.dispatch(showNotificationMessage('Please enter your email', NotificationColorMode.red))
    }

    this.setState({
      buttonState: ButtonState.loading,
    })

    this.props.dispatch(updateUserProfile(this.props.user.user.token, {
      firstName: firstName,
      lastName: lastName,
      userName: userName,
      email: email,
    }, true))

    if (editingPassword) {
      this.props.dispatch(updatePassword(this.props.user.user.token, password))
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  onTogglePasswordChange = () => {
    this.setState({
      editingPassword: !this.state.editingPassword
    })
  }

  onBackToMenu = () => {
    this.props.history.push('/settings/menu')
  }

  onShowPasswordForm = () => {
    this.setState({
      showNewPasswordForm: true,
    })
  }

  onClosePasswordForm = () => {
    this.setState({
      showNewPasswordForm: false,
    })
  }

  render () {
    const { firstName, lastName, userName, email, password, confirmPassword, editingPassword,  showNewPasswordForm } = this.state

    return (
      <div className='edit-profile-container' onClick={this.onCancelEdit}>
        <div className={classNames('profile-info', {'shrink': !editingPassword})} onClick={(e) => e.stopPropagation()}>
          {/* <div className='profile-header'>
            <span>Edit Profile</span>
            <span className='clickable' onClick={this.onTogglePasswordChange}>Change Password</span>
          </div> */}
          <div className='mobile-profile-header'>
            <span>Edit Profile</span>
            <img className='clickable' src={imgClose} alt='close' onClick={this.onBackToMenu}/>
          </div>

          <div className='input-group'>
            <div className='profile-input-double'>
              <div className='profile-input-field'>
                <span>First Name</span>
                <input name='firstName' value={firstName} onChange={this.onChange} disabled/>
              </div>
              <div className='profile-input-field'>
                <span>Last Name</span>
                <input name='lastName' value={lastName} onChange={this.onChange} disabled/>
              </div>
            </div>

            <div className='profile-input-field'>
              <span>Username</span>
              <input name='userName' value={userName} onChange={this.onChange} disabled/>
            </div>

            <div className='profile-input-field'>
              <span>Email</span>
              <input name='email' value={email} onChange={this.onChange} disabled/>
            </div>
          </div>
          
          <div className={classNames('profile-input-field', 'desktop', {'invisible': !editingPassword})}>
            <span>New Password</span>
            <input type='password' name='password' value={password} onChange={this.onChange} />
          </div>

          <div className={classNames('profile-input-field', 'desktop', {'invisible': !editingPassword})}>
            <span>New Password (confirm)</span>
            <input type='password' name='confirmPassword' value={confirmPassword} onChange={this.onChange}/>
          </div>

          <div className={classNames('password-change-instruction', 'desktop', {'invisible': !editingPassword})}>
            <div>We recommend choosing a password that</div>
            <div><img src={imgDot} alt='dot'/> Is not being used by you already for another account / login</div>
            <div><img src={imgDot} alt='dot'/> Is at least 8 characters in length</div>
            <div><img src={imgDot} alt='dot'/> Uses uppercase and lowercase letters</div>
            <div><img src={imgDot} alt='dot'/> Uses at least one number (0-9) and special characters (!@#$%^* …)</div>
          </div>

          {/* <div className='password-change-button clickable' onClick={this.onShowPasswordForm}>
            <span>Change your password</span>
            <img src={imgRightArrow} alt='arrow'/>
          </div>

          <Button className={classNames({'shrink': !editingPassword})} state={buttonState} onClick={this.onSave}>Save</Button> */}
        </div>

        { showNewPasswordForm && <NewPasswordForm onClose={this.onClosePasswordForm}/> }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(EditProfile)
