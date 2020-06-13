import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'

import './styles.css'
import imgArrow from '../../../assets/images/right_arrow_gray.svg'
import { logoutUser } from '../../../redux/actions/user';

class MobileSettingsMenu extends Component {
  onRefer = () => {
    if (this.props.user.loggedIn) {
      this.props.history.push('/invitation')
    } else {
      this.props.history.push('/auth/login')
    }
  }

  onSignout = () => {
    this.props.dispatch(logoutUser())
  }

  onWeeklyMenu = () => {
    this.props.history.push('/menu')
  }

  render () {
    const { firstName, lastName } = this.props.user.user

    return (
      <div className='mobile-settings-menu'>
        <div className='header'>
          <div className='account-name'>
            { `${firstName[0][0]}${lastName[0][0]}` }
          </div>
          {/* <Link to='/settings/editprofile'>Edit Account</Link> */}
        </div>

        <div className='menu-group'>
          <div className='menu-item clickable' onClick={this.onContact}>
            <span><Link to='/settings/editprofile'>Account Details</Link></span>
            <img src={imgArrow} alt='arrow'/>
          </div>
        </div>

        <div className='menu-group'>
          <div className='menu-item clickable' onClick={this.onPaymentMethods}>
            <span>Membership Level</span>
            <img src={imgArrow} alt='arrow'/>
          </div>
        </div>

        <div className='menu-group'>
          <div className='menu-item clickable' onClick={this.onPaymentMethods}>
            <span>Payments and Ad Credits</span>
            <img src={imgArrow} alt='arrow'/>
          </div>
        </div>

        <div className='menu-group'>
          <div className='menu-item clickable' onClick={this.onPaymentMethods}>
            <span>External Accounts</span>
            <img src={imgArrow} alt='arrow'/>
          </div>
        </div>

        <div className='menu-group'>
          <div className='menu-item clickable' onClick={this.onPaymentMethods}>
            <span>Ad Manager</span>
            <img src={imgArrow} alt='arrow'/>
          </div>
        </div>

        <div className='menu-group'>
          <div className='menu-item clickable' onClick={this.onSignout}>
            <span>Sign Out</span>
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

export default withRouter(connect(mapStateToProps)(MobileSettingsMenu))
