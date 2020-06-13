import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactTable from "react-table";

import {
  vanguardUserInfo,
} from '../../actions/vanguard';

import './index.css'

const columns = [
  {
    Header: "No",
    accessor: "id",
    width: 50
  },
  {
    Header: "User ID",
    accessor: "user_id",
    headerStyle: {
      textAlign: 'center'
   }
  },
  {
    Header: "UserName",
    accessor: "userName",
    headerStyle: {
      textAlign: 'center'
    }
  },     
  {
    Header: "Actions",
    accessor: "action",
    headerStyle: {
      textAlign: 'center'
    }
  },
];

class UsersComponent extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
    }
  }

  componentWillMount() {
    const { vanguardUserInfo } = this.props;
    vanguardUserInfo()
      .then(({ users }) => {
        this.setState({ users });
      })
      .catch(err=>{console.log(err);});
  }

  onEditPlaylist = (idx) => {
    const { users } = this.state;

    const user_id  = users[idx].id;
    const user_name = users[idx].username;
    sessionStorage.setItem('user_id', user_id);
    sessionStorage.setItem('user_name', user_name);
    this.props.history.push(`/users/${user_id}/user_edit`);
  }

  render() {
    const {
      users,
    } = this.state;

    const tableData = users.map(({ id, username }, idx) => ({
      id: idx + 1,
      user_id : <div style={{textAlign : "center"}}>{id}</div>,
      userName : <div style={{textAlign : "center"}}>{username}</div>,
      action: <button onClick={() => this.onEditPlaylist(idx)} style={{textAlign : "center"}}>Edit</button>,
    }));

    return (
      <div className="playlists-page">
        <h4>Tethyr.io Admin Panel</h4>
        <h4>5-1 User Settings</h4>
        <div className = "nav">
            <p className = "navbar-title">NAVBAR:</p>
        </div>
        <ReactTable
          data={tableData}
          sortable={false}
          columns={columns}
          defaultPageSize={25}
          showPaginationTop={false}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  vanguardUserInfo: bindActionCreators(vanguardUserInfo, dispatch),
})

export default connect(null, mapDispatchToProps)(UsersComponent);
