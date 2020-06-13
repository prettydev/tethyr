import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown'
//mport Button from '../../../../../../components/Button'
import 'react-simple-dropdown/styles/Dropdown.css'
import './styles.css'

import imgTriangle from '../../../../../../assets/images/dropdown_triangle.svg'
import imgTriangleWhite from '../../../../../../assets/images/dropdown_triangle_white.svg'
import hamburgerMenu from '../../../../../../assets/images/hamburger_menu.svg'
import imgTriangleReverse from '../../../../../../assets/images/dropdown_triangle_reverse.svg'
import imgTriangleReverseWhite from '../../../../../../assets/images/dropdown_triangle_reverse_white.svg'
import imgEditProfile from '../../../../../../assets/images/edit_profile.png'
import imgLogout from '../../../../../../assets/images/logout.png'
import imgClose from '../../../../../../assets/images/close_black.svg'
import { logoutUser } from '../../../../../../redux/actions/user';
import { hideNotificationMessage } from '../../../../../../redux/actions/notificationMessage';

class SettingsDropdown extends Component {

  menuFullyOpen = false

  constructor (props) {
    super(props) 

    this.state = {
      isShown: false,
    }
  }


  onToggle = (isShown) => {
    this.setState({
      isShown: isShown,
    })

    if (isShown) {
      setTimeout(() => {
        this.menuFullyOpen = true
      }, 500)
    } else {
      this.menuFullyOpen = false;
    }
  } 

  onClickBackground = () => {
    if (this.menuFullyOpen) {
      this.refs.settingsDropdown.hide()
    }
  }

  onMouseEnter = () => {
    this.refs.settingsDropdown.show()
  }

  onMouseLeave = () => {
    this.refs.settingsDropdown.hide()
  }

  onEditProfile = () => {
    this.refs.settingsDropdown.hide()
    this.props.history.push('/settings/editprofile')
  }

  onMyAccount = () => {
    this.refs.settingsDropdown.hide()
    this.props.history.push('/settings/menu')
  }

  onViewer = () => {
    this.refs.settingsDropdown.hide()
    this.props.history.push('/viewer')
  }

  onManage = () => {
    this.refs.settingsDropdown.hide()
    this.props.history.push('/manage')
  }

  onLogout = () => {
    this.refs.settingsDropdown.hide()
    this.props.dispatch(logoutUser())
    this.props.dispatch(hideNotificationMessage())
    this.props.history.replace('/')
  }

  onLogIn = () => {
    this.refs.settingsDropdown.hide()
    this.props.history.push('/auth/login')
  }

  onSignUp = () => {
    this.refs.settingsDropdown.hide()
    this.props.history.push('/auth/signup')
  }

  onHelp = () => {
    this.refs.settingsDropdown.hide()
    alert('Help Center~!!!')
  }

  onCloseMenu = () => {
    this.refs.settingsDropdown.hide()
  }

  onHome = () => {
    this.refs.settingsDropdown.hide()
    this.props.history.push('/')
  }

  render () {
    const { isShown } = this.state
    const { pathName, user } = this.props
    const isTransparentHeader = pathName.includes('careers')
    return (
      <div>
        {this.props.loggedIn &&
          <Dropdown ref='settingsDropdown' className='settings-dropdown' onShow={() => this.onToggle(true)} onHide={() => this.onToggle(false)}>
            <DropdownTrigger onClick={(e) => e && e.stopPropagation()}>
              <div className='settings-dropdown-trigger desktop clickable' onClick={this.onMouseEnter}>
                <span className={classNames({'span-highlighted': isShown, 'white': isTransparentHeader})}>Account Settings</span>
                <img src={ isShown ? (isTransparentHeader ? imgTriangleReverseWhite : imgTriangleReverse) : (isTransparentHeader ? imgTriangleWhite : imgTriangle) } alt='hamburger'/>
              </div>
              <div className='settings-dropdown-trigger mobile clickable' onClick={this.onMouseEnter}>
                <img src={hamburgerMenu} alt='hamburger' />
              </div>
            </DropdownTrigger>
            <DropdownContent onClick={this.onMouseLeave}>
              <div className='desktop'>
                <div className='div-menu-user-info clickable'>
                  <span className='bold'>{ user.user.userName }</span>
                  <span style={{marginTop:"5%"}}>{ user.user.email }</span>
                </div>
                <div className={classNames('div-menu', 'clickable', {'active': pathName.includes('settings/editprofile')})} onClick={ this.onEditProfile }>
                  <img src={imgEditProfile} alt='edit'/>
                  <span>Account Settings</span>
                </div>
                <div className='div-menu clickable' onClick={ this.onLogout }>
                  <img src={imgLogout} alt='logout'/>
                  <span>Log Out</span>
                </div>
              </div>
              <div className = 'mobile'>
                <div className='div-background' onClick={this.onClickBackground}/>
                <div className='div-menu-header'>
                  <img className='clickable' src={imgClose} alt='close' onClick={this.onCloseMenu}/>
                </div>
                {
                  <div className='div-menu-items'>
                    <div className={classNames('div-menu', 'clickable', {'active': pathName.includes('settings/menu')})} onClick={ this.onMyAccount }>
                      <span>My Account</span>
                    </div>
                    <div className={classNames('div-menu', 'clickable', {'active': pathName.includes('viewer')})} onClick={ this.onViewer}>
                      <span>Viewer</span>
                    </div>
                    <div className={classNames('div-menu', 'clickable', {'active': pathName.includes('manage') && !pathName.includes('settings')})} onClick={ this.onManage}>
                      <span>Manage</span>
                    </div>
                  </div>
                }
                <div className='div-menu-last-items'>
                  <div className='div-menu-last-item clickable' onClick={ this.onHelp }>
                    <span>Help & Contact</span>
                  </div>
                  <div className='div-menu-last-item clickable' onClick={ this.onLogout }>
                    <span>Log Out</span>
                  </div>
                </div>
              </div>
            </DropdownContent>
          </Dropdown>
        }
      </div>
    )
  }
}

function mapStateToProps({user}) {
  return {
    user,
  }
}

export default connect(mapStateToProps)(SettingsDropdown)
