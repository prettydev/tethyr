import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import imgLogo from '../../../../assets/images/LOGO_TYR.png'

import './styles.css'

class MobileFooter extends Component {
  onHome = () => {
    this.props.history.push('/')
  }

  render () {
    const {  location } = this.props

    return (
      <div className='responsive-app-footer'>
        <div className='footer-header'>
          <img src={imgLogo} alt='logo' onClick={this.onHome}/>
        </div>
        <div className='links'>
          <Link className={classNames({'highlighted': location.pathname.includes('about')})} to='/about'>About Us</Link>
          <Link className={classNames({'highlighted': location.pathname.includes('pricing')})} to='/pricing'>Pricing</Link>
          <Link to='/'>Help Center</Link>
          <Link to='/'>Contact Us</Link>
          <Link className={classNames({'highlighted': location.pathname.includes('terms')})} to='/terms'>Terms of Service</Link>
          <Link className={classNames({'highlighted': location.pathname.includes('privacy')})} to='/privacy'>Privacy</Link>
          <div className='footer-socials'>
            <a href='https://www.facebook.com/tethyrapp' target='_blank' rel='noopener noreferrer'><div id='facebook' className='social-link'/></a>
            <a href='https://twitter.com/tethyrapp' target='_blank' rel='noopener noreferrer'><div id='twitter' className='social-link'/></a>
            <a href='https://www.instagram.com/tethyrapp' target='_blank' rel='noopener noreferrer'><div id='instagram' className='social-link'/></a>
          </div>
        </div>
        <div className='separator'/>
        <div className='footer-bottom'>{`©${new Date().getFullYear()} Tethyr. All Rights Reserved `}</div>
      </div>
    )
  }
}

function mapStateToProps({ user }) {
  return {
    user,
  }
}

export default withRouter(connect(mapStateToProps)(MobileFooter))
