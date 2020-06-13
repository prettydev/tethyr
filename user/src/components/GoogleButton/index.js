import React, { Component } from 'react'
import { connect } from 'react-redux'
import { GoogleLogin } from 'react-google-login'
import { showNotificationMessage, NotificationColorMode } from '../../redux/actions/notificationMessage'

import './styles.css'
import imgGoogle from '../../assets/images/google_white.svg'

class GoogleButton extends Component {

  responseGoogle = (response) => {
    console.log(response)
    if (response.profileObj) {
      this.props.onAuthenticated({
        email: response.profileObj.email,
        firstName: response.profileObj.givenName,
        lastName: response.profileObj.familyName,
      })
    } else if (response.error !== 'popup_closed_by_user') {
      this.props.dispatch(showNotificationMessage('Failed to authenticate with google.', NotificationColorMode.red))
    }
  }

  render () {
    return (
      <div className='google-button'>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
        >
          <img src={imgGoogle} alt='google'/>
          <span>Continue with Google</span>
        </GoogleLogin>
      </div>
    )
  }
}

export default connect()(GoogleButton)
