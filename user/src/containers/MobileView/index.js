import React, { Component } from 'react'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { authenticateUser } from '../../redux/actions/user'

import './styles.css'

class MobileView extends Component {
  
  componentDidMount() {
    const values = queryString.parse(this.props.location.search)
    const token = values.token;
    this.props.dispatch(authenticateUser(token))
  }

  render() {
    return (
      <div className='div-home-container'>
        <div className='div-top-container'>
          <div className='expired_warning'>Go to the main page!</div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(MobileView)
