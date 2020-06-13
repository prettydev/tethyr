import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"
import classNames from 'classnames'
import Button from '../../../../components/Button'
import SettingsDropdown from './components/SettingsDropdown'
import imgLogoWhite from '../../../../assets/images/logo_white_text.png'

import './styles.css'

class Header extends Component {

  onClickLogo = () => {
    this.props.history.push('/')
  }

  onLogin = () => {
    this.props.history.push('/auth/login')
  }

  onSignUp = () => {
    this.props.history.push('/auth/signup')
  }

  render () {
    const { pathName, user, history, notificationMessage } = this.props
    return (
      <div className={classNames('app-header', {'notification': notificationMessage.visible})}>
        <div className='container'>
          <img className={classNames('img-logo clickable')} src={imgLogoWhite} alt='logo' onClick={this.onClickLogo}/>
          { 
            user.loggedIn && !pathName.includes('notavailable') && !pathName.includes('auth/signup') && !pathName.includes('terms') && !pathName.includes('business') &&
            <div className='div-links'>
              <Link to='/tour'><span className='clickable'>Tour</span></Link>
              <Link to='/viewer'><span className='clickable'>Tethyr Viewer</span></Link>
              <Link to='/manage'><span className='clickable'>Groups Manager</span></Link>
              <SettingsDropdown
              pathName={ pathName }
              history={ history }
              loggedIn={ user.loggedIn }
            />
            </div>
          }
          <div className='div-buttons'>
            <div className='desktop-buttons'>
              { !user.loggedIn && <div className='div-login clickable' onClick={this.onLogin}>Log In</div> }
              { !user.loggedIn && <Button id='btn_signup' onClick={this.onSignUp}>SIGN UP</Button> }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    notificationMessage: state.notificationMessage,
  }
}

export default connect(mapStateToProps)(Header)
