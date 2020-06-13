import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import './styles.css'
import imgClose from '../../assets/images/message_close.svg'
import { NotificationColorMode, hideNotificationMessage, NotificationPosition } from '../../redux/actions/notificationMessage';
import { resendConfirmLink } from '../../services/resendConfirmLink';

class NotificationMessage extends Component {

  onClose = () => {
    this.props.dispatch(hideNotificationMessage())
  }

  resendConfirmLink = (e) => {
    e.preventDefault()

    resendConfirmLink(this.props.user.user.user_id)
      .then(res => {
        console.log('resent the confirm link!')
      })
      .catch(err => {
        console.log(err)
      })
  }

  render () {
    console.log(this.props.user)
    const { message, colorMode, position, resentLink } = this.props.notificationMessage
    let colorClass = '';
    switch (colorMode) {
      case NotificationColorMode.black:
        colorClass = 'black'
        break
      case NotificationColorMode.red:
        colorClass = 'red'
        break
      case NotificationColorMode.green:
        colorClass = 'green'
        break
      default:
        colorClass = 'black'
    }

    return (
      <div className={classNames('notification-message-box', colorClass, {'top': position === NotificationPosition.top})}>
        <div className='notification-message'>{ message } {resentLink ? <span className='clickable' onClick={this.resendConfirmLink}>Resend Link!</span> : ''}</div>
        <img className='img-close clickable' src={imgClose} alt='close' onClick={ this.onClose }/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    notificationMessage: state.notificationMessage,
    user: state.user,
  }
}

export default connect(mapStateToProps)(NotificationMessage)
