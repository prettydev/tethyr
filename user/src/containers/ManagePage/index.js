import React, { Component } from 'react';
import { connect } from 'react-redux'
//import TopHeaderBar from '../../components/TopHeaderBar';
import ItemList from './components/ItemList/index'

import { logoutUser } from '../../redux/actions/user'
import Header from './components/Header'

class ManagePage extends Component {

  componentDidMount() {
    if(!this.props.user.loggedIn) {
      this.props.history.push('/auth/login')
    }
  }

  logout = () => {
    this.props.dispatch(logoutUser())
    this.props.history.replace('/')
  }

  render() {
    const { history, location} = this.props
    return (
      <React.Fragment>
         <Header history={history} pathName={location.pathname} />
        <ItemList />
      </React.Fragment>
    );
  }
}

function mapStateToProps({ user }) {
  return {
    user,
  }
}

export default connect(mapStateToProps)(ManagePage)