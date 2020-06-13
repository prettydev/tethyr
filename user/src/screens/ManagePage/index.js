import React, { Component } from 'react'
import { connect } from 'react-redux'
import TopHeaderBar from '../../components/TopHeaderBar'
import ItemList from './components/ItemList/index'
import { logoutUser } from '../../redux/actions/user'

class ManagePage extends Component {

  onLogout = () => {
    this.props.dispatch(logoutUser())
    this.props.history.replace('/')
  }

  render() {
    return (
      <React.Fragment>
        <TopHeaderBar
          logout={this.onLogout}
          scene = 'manage'
        />
        <ItemList />
      </React.Fragment>
    );
  }
};

export default connect()(ManagePage)
