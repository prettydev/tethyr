import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ReactTable from "react-table";
import { CSVLink } from 'react-csv/lib';
import Switch from "react-switch";

import { fetchGridsetsByID, swapGridsetOrder, fetchAllGridsets, addNewGridset, removeUserGridset, resetAllGridset, updateLocked } from '../../actions/gridset';
import { vanguardUserInfo } from '../../actions/vanguard';

import './index.css'

const columns = [
  {
    Header: "USER ID",
    accessor: "user_id",
    width: 70,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "Button to Reorder",
    accessor: "reorderAction",
    width: 200,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "",
    accessor: "sort_id",
    width: 50,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "Locked/Unlocked",
    accessor: "pwd_locked",
    width: 100,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "Group Name",
    accessor: "name",
    width: 200,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "Group Description",
    accessor: "description",
    width: 400,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "Actions",
    accessor: "actions",
    width: 300,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
]

const headers = [
  { label: "USER ID", key: "userData" },
  { label: "Order", key: "sort_id" },
  { label: "Gridset Title", key: "name" },
  { label: "Gridset Description", key: "description" },
];

class UserDetail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      allGridsets: [],
      title: '',
      description: '',
      users: [],
      gridsets: [],
      gridset_id: 0,
      showMsg : false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (window.location.pathname !== nextProps.location.pathname) {
      this.props.history.replace('/users');
    }
  }

  componentWillMount() {
    const { fetchAllGridsets, vanguardUserInfo } = this.props;
    vanguardUserInfo()
    .then(res=>{
      const users = res.users;
      fetchAllGridsets()
      .then(res=>{
        this.setState({
          allGridsets:res.gridsets,
          gridset_id: res.gridsets[0].id,
          users
        })
      })
      .catch(err=>{console.log(err);})
      this.getGridsets();
    })
    .catch(err=> {console.log(err);})
  }

  getGridsets = () => {
    const user_id = sessionStorage.getItem('user_id');
    const { fetchGridsetsByID } =this.props;
    fetchGridsetsByID(user_id)
    .then(res=>{
      this.setState({
        gridsets:res.gridsets,
      })
    })
    .catch(err=>{console.log(err);})
  }

  setGridsets = (user_id) => {
    const { fetchGridsetsByID } = this.props;
    fetchGridsetsByID(user_id)
      .then((res) => {
        this.setState({
          gridsets : res.gridsets,
        });
        this.props.history.push(`/users/${user_id}/user_edit`);
      })
  }

  onUserSelect = (e) => {
    const { users } = this.state;
    const id = e.target.selectedIndex;
    const user_name = e.target.value;
    const user_id = users[id].id;
    sessionStorage.setItem('user_id', user_id);
    sessionStorage.setItem('user_name', user_name);
    this.setGridsets(user_id);
  }

  onGridsetSelect = (e) => {
    this.setState({
      gridset_id : e.target.value,
    })
  }

  onChangeValue = (field, value) => {
    const state = {};
    state[field] = value;
    this.setState(state);
  }

  onAddNewGridset = () => {
    clearTimeout(this.timer);
    const { gridset_id } = this.state;
    const { addNewGridset } = this.props;
    const user_id = sessionStorage.getItem('user_id');
    addNewGridset(user_id, gridset_id)
    .then(res=>{
      if(res.gridsets === false)
      {
        this.setState({showMsg : true});
        this.timer = setTimeout(() => {
          this.setState({ showMsg: false });
          }, 3000);
      }
      else {
        this.setState({ gridsets:res.gridsets });
      }
    })
    .catch(err=>{console.log(err);})
  }

  onMoveGridset = (idx, up) => {
    const user_id = sessionStorage.getItem('user_id');
    const { gridsets } = this.state;
    const order = idx - up;
    const { swapGridsetOrder } = this.props;
    swapGridsetOrder(user_id, gridsets[idx].sort_id, gridsets[order].sort_id)
      .then(({gridsets}) => {
        this.setState({ gridsets:gridsets });
      })
  }

  onremoveUserGridset = (idx) => {
    const { gridsets } = this.state;
    const user_id = sessionStorage.getItem('user_id');
    const { removeUserGridset } = this.props;
    const gridset_id = gridsets[idx].gridset_id
    const sort_id = gridsets[idx].sort_id;
    removeUserGridset(user_id, gridset_id, sort_id)
    .then(res=>{
      this.setState({ gridsets:res.gridsets });
    })
    .catch(err=>{
      console.log(err);
    })
  }

  onEditGridset = (idx) => {
    const user_id = sessionStorage.getItem('user_id');
    const { gridsets } = this.state;
    const gridset_id = gridsets[idx].gridset_id;
    const gridset_title = gridsets[idx].name;
    sessionStorage.setItem('gridset_id', gridset_id);
    sessionStorage.setItem('gridset_title', gridset_title);
    this.props.history.push(`/users/${user_id}/user_playlist`);
  }

  resetAllGridset = (gridset_id, name) => {
    const user_id = sessionStorage.getItem('user_id');
    const { resetAllGridset } = this.props;
    resetAllGridset(user_id, gridset_id)
    .then(res=>{
        alert(`The gridset ${gridset_id}#${name} has reset!`)
    })
    .catch(err=>{console.log(err);})
  }

  handleChange = (idx) => (checked) => {
    const { gridsets } = this.state;
    gridsets[idx].locked = checked === true ? 1 : 0;
    const user_id = sessionStorage.getItem('user_id');
    const { updateLocked } = this.props;
    updateLocked(user_id,gridsets[idx].gridset_id,  gridsets[idx].locked)
    .then(() => {
      this.setState({
        gridsets
      })
    })
    .catch(err=> {
      console.log(err);
    })
  }

  render() {
    const { gridsets, users, allGridsets, showMsg, gridset_id } = this.state;
    const user_id = sessionStorage.getItem('user_id');
    const user_name = sessionStorage.getItem('user_name');

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    const fileName = `USER#${user_id}_Gridsets_${dateTime}`;

    const tableData = gridsets.map(({ gridset_id, name, description, pwd_protected, locked }, idx) => ({
      user_id,
      reorderAction: (
        <div>
          {idx > 0 && <button onClick={() => this.onMoveGridset(idx, 1)}>Move Up</button>}
          {idx < gridsets.length - 1 && <button onClick={() => this.onMoveGridset(idx, -1)}>Move Down</button>}
        </div>
      ),
      sort_id : idx,
      pwd_locked : <Switch onChange={this.handleChange(idx)} checked={ (pwd_protected === 0 ) ? false : (locked === 0 ? false : true)} disabled={pwd_protected === 0 ? true : false}/>,
      name,
      description,
      actions: (
        <div>
          <button onClick={() => this.onEditGridset(idx)}>Edit</button>
          <button style={{ height:"26px", marginLeft:"10px"}} onClick={() => this.resetAllGridset(gridset_id, name)}>Reset this Group</button>
          <button style={{ height:"26px", marginLeft:"10px"}} onClick={() => this.onremoveUserGridset(idx)}>Remove</button>
        </div>
      ),
    }));

    return (    
      <div className="playlist-detail-page">
        <h4>Tethyr.io Admin Panel</h4>
        <h4>5-2 Tethyr.io Admin Panel</h4>
        <div className = "nav">
          <p className = "navbar-title">NAVBAR:</p>
          <p className = "navbar-item">USER {user_id}:{user_name}</p>
        </div>
        <div className="playlist-info-panel">
          <div className="info-item">
            <label>User ID</label>
            <select value={user_name} onChange={this.onUserSelect}>
              {
                users.map((user, index) => (
                  <option key={index} value={user.username}>{user.id}</option>
                ))
              }
            </select>
          </div>
        </div>
        <div className="info-item">
          <label>All Groups</label>
          <select value={gridset_id} onChange={this.onGridsetSelect} >
            {
              allGridsets.map((gridset, index) => (
                <option key={index} value={gridset.id}>gridset{gridset.id} {gridset.name}</option>
              ))
            }
          </select>
        </div>
        
        <button onClick={this.onAddNewGridset}>Add New Playlist Group</button>
        <button style={{ height:"26px", marginLeft:"10px"}}><CSVLink filename={`${fileName}.csv`} data={tableData} headers={headers} style={{color:"black"}}>Export User Groups</CSVLink></button>
        { showMsg && <h4 className="warning">This group already exists!</h4>}
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
  fetchGridsetsByID: bindActionCreators(fetchGridsetsByID, dispatch),
  fetchAllGridsets: bindActionCreators(fetchAllGridsets, dispatch),
  swapGridsetOrder: bindActionCreators(swapGridsetOrder, dispatch),
  addNewGridset: bindActionCreators(addNewGridset, dispatch),
  removeUserGridset: bindActionCreators(removeUserGridset, dispatch),
  vanguardUserInfo : bindActionCreators(vanguardUserInfo, dispatch),
  resetAllGridset : bindActionCreators(resetAllGridset, dispatch),
  updateLocked : bindActionCreators(updateLocked, dispatch),
})

export default connect(null, mapDispatchToProps)(UserDetail);
