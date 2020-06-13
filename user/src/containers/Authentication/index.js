import React, { Component } from 'react'
import routes from './routes'

import './styles.css'

class Authentication extends Component {

  render () {
    return (
      <div className='div-auth-container'>
        { routes }    
      </div>
    )
  }
}

export default Authentication
