import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import imgLogo from '../../../../assets/images/LOGO_TYR.png'
//import imgAppStore from '../../../../assets/images/app_store.jpg'
//import imgGooglePlay from '../../../../assets/images/google_play.png'
import './styles.css'

class Footer extends Component {

  render () {

    return (
      <div className='app-footer'>
        {/* Middle Section */}
        <div className='div-footer-middle-container container'>
          <div className='div-footer-logo'>
            <Link to='/'><img className='clickable' src={imgLogo} alt='logo'/></Link>
            {/* <div className='store-links'>
              <img src={imgAppStore} alt='apple'/>
              <img src={imgGooglePlay} alt='google'/>
            </div> */}
          </div>

          <div className='groups'>
            
          <div className='div-footer-middle-links-group'>
              <div className='footer-middle-links-header'>
                Tethyr.io
              </div>
              <Link to='/' className='footer-middle-link'>What is Tethyr?</Link>
              <Link to='/tour' className='footer-middle-link'>Tour</Link>
              <Link to='/viewer' className='footer-middle-link'>Tethyr Viewer</Link>
              <Link to='/manage' className='footer-middle-link'>Group Manager</Link>
              <Link to='/settings/editprofile' className='footer-middle-link'>Account Settings</Link>
              
            </div>

            {/* <div className='div-footer-middle-links-group'>
              <div className='footer-middle-links-header'>
                PRODUCT
              </div>
              <Link to='/mobile' className='footer-middle-link'>Mobile App</Link>
            </div> */}

            <div className='div-footer-middle-links-group'>
              <div className='footer-middle-links-header'>
                HELP
              </div>
              <a href='mailto:tethyrapp@gmail.com' className='footer-middle-link'>Contact Us</a>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className='div-footer-bottom-container container'>
          <span className='footer-bottom-link'>{`©${new Date().getFullYear()} Tethyr - All rights reserved`}</span>
          <div className='bottom-right'>
            <Link to='/terms'><span className='footer-bottom-link'>Terms of Service</span></Link>
            <Link to='/privacy'><span className='footer-bottom-link'>Privacy Policy</span></Link>
            <a href='https://www.facebook.com/tethyrapp' target='_blank' rel='noopener noreferrer'><div id='facebook' className='div-social-link'/></a>
            <a href='https://twitter.com/tethyrapp' target='_blank' rel='noopener noreferrer'><div id='twitter' className='div-social-link'/></a>
            <a href='https://www.instagram.com/tethyrapp' target='_blank' rel='noopener noreferrer'><div id='instagram' className='div-social-link'/></a>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ user }) {
  return {
    user,
  }
}

export default withRouter(connect(mapStateToProps)(Footer))
