import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string';
import { confirmUserMail } from '../../../../redux/actions/user'

import './styles.css'

class ConfirmMailForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: props.user.user.status,
    }
  }
  toMainPage = () => {
    this.props.history.push('/viewer')
  }

  componentDidMount() {
    let params = queryString.parse(this.props.location.search)
    let token = params.token
    let unique_id = this.props.match.params.unique_id;
    const loggedIn = !this.props.user.logginIn && this.props.user.loggedIn;
    this.props.dispatch(confirmUserMail(unique_id, token, loggedIn))
  }

  componentDidUpdate() {
    if(this.state.status !== this.props.user.user.status) {
      this.setState({
        status: this.props.user.user.status,
      })
    }
  }

  render () {
    return (
      <div className='confirm-mail-form'>
        {this.state.status === 'Active' ?
          <React.Fragment>
            <p className='title'>Thanks for confirming your email!</p>
            <p  className='link-green' onClick={this.toMainPage}>go to main page</p>
          </React.Fragment>
          :
          <p className='title'>Invalid token!</p>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default withRouter(connect(mapStateToProps)(ConfirmMailForm))
