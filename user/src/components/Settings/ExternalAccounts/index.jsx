import React from 'react'
import {connect} from 'react-redux'
import cn from 'classnames'
import './style.css'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import {services, loadAccounts, toggleAccount} from 'redux/actions/settings/externalAccounts'
import Alert from '@material-ui/lab/Alert';

const buttons = Object.keys(services)

const ExternalAccounts = ({accounts, error, loadAccounts, toggleAccount}) => {
  React.useEffect(() => {
    loadAccounts()
  }, [])

  return <div className='external-accounts-container'>
    <Alert severity="info">
        This feature is in development.
      </Alert>
      <br />
    <div className='external-accounts-content'>
      <div className='external-accounts-title'>
        External Services
      </div>
      {error && <div className='external-accounts-error'>{error.message}</div>}
      <FacebookLogin
        appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
        callback={({name}) => toggleAccount(accounts, 'facebook', name)}
        render={({onClick: facebookOnClick}) => (
          <div className='external-accounts-buttons'>
            {buttons.map((type) => {
              const username = accounts[type]
              const onClick = type === 'facebook' ?
                facebookOnClick :
                () => toggleAccount(accounts, type)

              return <div key={type} className='external-accounts-row'>
                <div className='external-accounts-main'>
                  <div className={`external-accounts-logo external-accounts-${type}`}/>
                  {username && <div className='external-accounts-username'>{username}</div>}
                </div>
                <div
                  onClick={onClick}
                  className={cn('external-accounts-button', username && 'external-accounts-button-connect')}
                >
                  {username ? 'Disconnect' : 'Connect'}
                </div>
              </div>
            })}
          </div>
        )}
      />
    </div>
  </div>
}

const mapStateToProps = ({
  externalAccounts: {accounts, error}
}) => ({
  accounts, error
})

const mapDispatchToProps = {
  toggleAccount,
  loadAccounts,
}

export default connect(mapStateToProps, mapDispatchToProps)(ExternalAccounts)
