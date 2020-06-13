import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import routes from './routes'
import SettingsMenu from './components/SettingsMenu'
import imgSettings from '../../assets/images/settings.svg'
import './styles.css'

class Settings extends Component {

  render () {
    const { location, history, user } = this.props

    return (
      user.loggedIn ?
      <div className='div-settings-container'>
        {/* Main Area */}
        <div className='div-settings-body container'>
          {/* Header */}
          {
            !location.pathname.includes('orderhistory') &&
            <React.Fragment>
              <div className='div-settings-header'>
                <div>
                  <img src={imgSettings} alt='settings'/>
                  <span>Accounts Settings</span>
                </div>
              </div>
              <div className='div-settings-menu'>
                <SettingsMenu
                  location={ location }
                  history={ history }
                />
              </div>
            </React.Fragment>
          }
  
          {/* Page Area */}
          <div className='div-settings-page'>
            { routes }
          </div>
        </div>
      </div>
      :
      <Redirect to='/auth/login'/>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(Settings)
