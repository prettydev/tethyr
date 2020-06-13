import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ReactTable from "react-table";
import Modal from 'react-modal/lib';

import {
  addGridset,
  fetchAllGridsets,
  fetchGridset,
  updateGridset,
  disableGridset,
  getGridsetTitle,
  removeGridset,
  setGridsetPassword,
  updateGridsetVisibility
} from '../../actions/gridset';

import {
  showOverlaySpinner,
  hideOverlaySpinner
} from '../../actions/overlaySpinner'

import {
  fetchAllPlaylists,
  removePlaylist,
  addPlaylist,
  swapPlaylistOrder
} from '../../actions/playlist'

import './styles.css';

const customStyles = {
  content : {
    top         : '50%',
    left        : '50%',
    right       : 'auto',
    bottom      : 'auto',
    marginRight : '-50%',
    transform   : 'translate(-50%, -50%)',
    width       : '300px'
  }
};

Modal.setAppElement('#root')

const columns = [
  {
    Header: "Playlist Group ID",
    accessor: "id",
    headerStyle: {
      textAlign: 'left',
    }
  },
  {
    Header: "Group Name",
    accessor: "name",
    headerStyle: {
      textAlign: 'left'
    }
  },
  {
    Header: "Group Description",
    accessor: "description",
    headerStyle: {
      textAlign: 'left'
    }
  },
  {
    Header: "Group Thumbnail",
    accessor: "thumb",
    headerStyle: {
      textAlign: 'left'
    }
  },
  {
    Header: "Enable/Disable",
    accessor: "enable",
    headerStyle: {
      textAlign: 'left',
    }
  },
  {
    Header: "Password Protected",
    accessor: "pwd_protected",
    headerStyle: {
      textAlign: 'left',
    }
  },
  {
    Header: "Visibility",
    accessor: "visibility",
    headerStyle: {
      textAlign: 'left',
    }
  },
  {
    Header: "Edit",
    accessor: "edit",
    headerStyle: {
      textAlign: 'left',
    }
  }
];

const playlist_columns = [
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
    accessor: "order",
    width: 30,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "Button to Remove",
    accessor: "removeAction",
    width: 100,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "GSPN",
    accessor: "gspn",
    width: 320,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
  {
    Header: "Playlist Title",
    accessor: "playlist_title",
    width: 400,
    headerStyle: {
      fontSize: 12,
      textAlign: 'left'
    }
  },
]

class Gridsets extends Component {
  constructor() {
    super();

    this.state = {
        edit: false,             //enable to edit the playlists of the playlist group
        userIndex: -1,
        gridsets: [],
        playlists : [],
        allPlaylists : [],
        savePlaylist_id : -1,
        modalIsOpen : false,
        gridsetIndex : -1,
        gridset_id : 0,
        _password : "",
    };

    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount () {
    this.fetchAllGridsets();
  }

  fetchAllGridsets = () => {
    const { fetchAllGridsets, fetchAllPlaylists } = this.props;
    fetchAllGridsets()
      .then(({ gridsets }) => {
        this.setState({ gridsets });
        fetchAllPlaylists()
        .then(({playlists}) => {
            this.setState({allPlaylists : playlists})
        })
        .catch()
      })
      .catch();
  }

  onNewGridset = () => {
    const name = document.getElementById('newname').value.trim();
    const description = document.getElementById('newdescription').value.trim();
    const thumb = document.getElementById('newthumb').value.trim();
    const visibility = document.getElementById('newvisibility').selectedIndex;
    const active = 1;
    if (name === '' || description === '' || thumb === '') {
      return alert('Name or Description can\'t be blank!');
    }
    const { addGridset } = this.props;
    addGridset({name, description, thumb, visibility, active})
      .then(({success, id}) => {
        if(success) {
          const { gridsets } = this.state;
          gridsets.push({
            id,
            name,
            description,
            thumb, 
            active,
            visibility
          });
          this.setState({ gridsets }, () => {
            alert(`The gridset with ${name} added!`)
          });
        }
        else {
          alert(`The gridset with ${name} already exists!`)
        }
      })
  }

  onNewPlaylist = () => {

    const { addPlaylist } = this.props;
    const { gridsets, userIndex, allPlaylists } = this.state;
    const gridset_id = gridsets[userIndex].id;
    const playlist_id = parseInt(this.state.savePlaylist_id);

    if(isNaN(playlist_id) || playlist_id === -1)
    {
      return false;
    }
    
    const title = allPlaylists[playlist_id].title;
    const gspn =  allPlaylists[playlist_id].gspn;

    addPlaylist(gridset_id, playlist_id + 1)
    .then(({success, playlists})=> {
      if(success) {
        this.setState({playlists}, ()=>{
          alert(`The playlist ${gspn}#${title} added!`)
        })
      }
      else {
        alert(`The playlist ${gspn}#${title} already exists!`)
      }
    })
    .catch(err=> { console.log(err);})
  }

  onEditGridset = (index) => {
    const user = this.state.gridsets[index];
    const { fetchGridset, showOverlaySpinner, hideOverlaySpinner } = this.props;
    showOverlaySpinner();
    const {
      id,
      name,
      description,
      thumb,
      password
    } = user;
    fetchGridset(id)
      .then(({playlists}) => {
        this.setState({
          edit: true,
          userIndex: index,
          name,
          description,
          thumb,
          password: password ? password : '',
          playlists
        }, () => {
          hideOverlaySpinner();
        });
      })
      .catch(err=>{console.log(err);})
  }

  onRemoveGridset = (index) => {
    const id = this.state.gridsets[index].id;
    const { removeGridset, showOverlaySpinner, hideOverlaySpinner } = this.props;

    showOverlaySpinner();
    removeGridset(id)
      .then(() => {
        let gridsets = this.state.gridsets;
        gridsets = gridsets.slice(0);
        gridsets.splice(index, 1)
        this.setState({
            gridsets
        }, () => {
          hideOverlaySpinner();
        });
      })
      .catch(err=>{console.log(err);})
  }

  setVisibility = (idx, e) => {
    const { gridsets } = this.state;
    const id = gridsets[idx].id;
    const visibility = e.target.selectedIndex;
    
    const { updateGridsetVisibility } = this.props;
    updateGridsetVisibility(id, visibility)
    .then(() => {
      gridsets[idx].visibility = visibility;
      this.setState({
        gridsets
      })
    })
    .catch(err=>{console.log(err);})
  }

  onDisableGridset = (index, disable) => {
    const user = this.state.gridsets[index];
    const { disableGridset } = this.props;
    disableGridset(user.id, disable)
      .then(() => {
        this.fetchAllGridsets();
      })
      .catch(() => {
        this.fetchAllGridsets();
      });
  }

  updateState = (field, value) => {
    const obj = {};
    obj[field] = value;
    this.setState(obj);
  }

  onSaveGridset = () => {
    const {
      gridsets,
      userIndex,
      name,
      description,
      thumb,
      password,
    } = this.state;
    const id = gridsets[userIndex].id;
    gridsets[userIndex].name = name;
    gridsets[userIndex].description = description;
    gridsets[userIndex].thumb = thumb;
    const user = {
      id,
      name,
      description,
      thumb,
      password,
    };
    const { updateGridset } = this.props;
    updateGridset(user)
      .then(() => {
        this.setState({
          gridsets,
          _password : password
        }, () => {
          alert(`Gridset ${id} saved successfully!`);
        })
      })
  }

  onGridsetSelect = (e) => {
    const index = e.target.value;
    this.setState({
      savePlaylist_id : index,
    })
  }

  onRemovePlaylist = (idx) => {
    const { removePlaylist } = this.props;
    const { gridsets, userIndex } = this.state;
    var playlists  = this.state.playlists;
    const gspn = playlists[idx].gspn;
    const id = gridsets[userIndex].id;
    removePlaylist(id, gspn)
    .then(({playlists})=>{
      this.setState({
        playlists
      })
    })
    .catch(err=>{console.log(err);})
  }

  onMovePlaylist = (idx, up) => {
    const { playlists, gridsets, userIndex } = this.state;
    const id = gridsets[userIndex].id;
    const order = idx - up;
    if(order === idx) idx = idx + 1;
    const gspn = playlists[idx].gspn;
    const swap_gspn = playlists[order].gspn;
    const { swapPlaylistOrder } = this.props;
    swapPlaylistOrder(id, gspn, swap_gspn)
    .then(({playlists}) => {
      this.setState({
        playlists
      })
    })
  }

  passwordProtected = (idx) => (e) => {
    const { gridsets } = this.state;
    const { setGridsetPassword } = this.props;
    let modalIsOpen = false;
    const gridset_id = gridsets[idx].id;
    const password = gridsets[idx].password;
    if(e.target.checked) {
      gridsets[idx].pwd_protected = 1;
      modalIsOpen = true;
      this.setState({
        gridsets,
        modalIsOpen,
        gridset_id,
        gridsetIndex : idx,
        _password : password
      })
    }
    else {
      gridsets[idx].pwd_protected = 0;
      setGridsetPassword(gridset_id, password, 0)
      .then(()=>{
        this.setState({
          gridsets,
          gridset_id,
          gridsetIndex : idx,
          _password : password
        })
      })
    }
  }

  setPassword = (e) => {
    this.setState({
      _password : e.target.value
    })
  }

  savePassword = () => {
    const {gridsets, gridset_id, gridsetIndex, _password} = this.state;
    const { setGridsetPassword } = this.props;
    gridsets[gridsetIndex].password = _password;
    setGridsetPassword(gridset_id, _password, 1)
    .then(()=>{
      alert(`The password of Gridset#${gridset_id} ${gridsets[gridsetIndex].name} has set`)
      this.setState({
        modalIsOpen : false,
        gridsets
      })
    })
  }

  closeModal() {
    const { gridsetIndex, gridsets } = this.state;
    gridsets[gridsetIndex].pwd_protected = 0;
    this.setState({
      gridsets,
      modalIsOpen: false
    });
  }

  onGridsetEdit = (e) => {
    const index = e.target.selectedIndex - 1;
    if(index === -1) {
      this.setState({
        edit : false,
      })
    }
    else {
      this.onEditGridset(index)
    }
  }

  render() {
    const {
      edit,
      userIndex,
      gridsets,
      name,
      description,
      thumb,
      password,
      playlists,
      allPlaylists,
      _password
    } = this.state;
    const tableData = gridsets.map(({ id, name, description, thumb, pwd_protected, active, visibility }, idx) => ({
      id,
      pwd_protected :
        <input type='checkbox' checked = { pwd_protected === 1 ? 'checked' : ''}  onChange={this.passwordProtected(idx)} disabled/>,
      name,
      description,
      thumb,
      edit:
        <div>
          <button onClick={() => this.onEditGridset(idx)}>edit</button>
          <button onClick={() => this.onRemoveGridset(idx)}>remove</button>
        </div>,
      enable: <button onClick={() => this.onDisableGridset(idx, active === 1)} disabled>{active === 1 ? 'Disable' : 'Enable'}</button>,
      visibility:
        <select onChange={(e) => this.setVisibility(idx, e)} value={visibility === 0 ? 'public' : 'private'}>
          <option value='public'>Public</option>
          <option value='private'>Private</option>
        </select>
    }));

    const playlistData = playlists.map(({gspn, title, playlist_order}, idx) => ({
      reorderAction: (
        <div>
          {idx > 0 && <button onClick={() => this.onMovePlaylist(idx, true)}>Move Up</button>}
          {idx < playlists.length - 1 && <button onClick={() => this.onMovePlaylist(idx, false)}>Move Down</button>}
        </div>
      ),
      order : playlist_order,
      removeAction: (
        <button onClick={() => this.onRemovePlaylist(idx)}>Remove</button>
      ),
      gspn,
      playlist_title: title
    }));

    return (
      <div className="gridsets-page">
        <h4>Tethyr.io Admin Panel</h4>
        <h4>3-1 Playlist Groups</h4>
        <div className='new-user-panel'>
          <div className='info-item'>
            <label>Name</label>
            <input type='text' id='newname' />
          </div>
          <div className='info-item'>
            <label>Description</label>
            <input type='text' id='newdescription' />
          </div>
          <div className='info-item'>
            <label>Thumbnail</label>
            <input type='text' id='newthumb' />
          </div>
          <div className='info-item'>
            <label>Visibility</label>
            <select id='newvisibility'>
              <option>Public</option>
              <option>Private</option>
            </select>
          </div>
          <div className='info-item'>
            <button onClick={this.onNewGridset}>New Playlist Group</button>
          </div>
        </div>
        <div className="info-item">
          <label>Playlist Group</label>
          <select onChange={this.onGridsetEdit}>
            <option>Please select the playlist group</option>
            {
              gridsets.map(({id, name}, index) => (
                <option key={index} value={id}>{id} {name}</option>
              ))
            }
          </select>
        </div>
        <ReactTable
          data={tableData}
          sortable={false}
          columns={columns}
          defaultPageSize={25}
          showPaginationTop={false}
          className="-striped -highlight"
        />
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Enter the password"
        >
          <h5>Enter the password:</h5>
          <input type='text' value={_password} onChange={this.setPassword} />
          <div style={{display: "flex", justifyContent:"space-between"}}>
            <button style={{width:"100px"}} onClick={this.savePassword} disabled = {_password.length === 0 ? "disabled" : ""} >Save</button>
            <button style={{width:"100px"}} onClick={this.closeModal}>Cancel</button>
          </div>
        </Modal>
        {
          edit &&
          <div className='edit-user-info-container'>
            <h4>Tethyr.io Admin Panel</h4>
            <h4>3-2 Playlist Group Editor</h4>
            <div className='user-basic-info'>
              <div className='info-item'>
                <label>Playlist Group Id</label>
                <input type='text' value={gridsets[userIndex].id} disabled />
              </div>
              <div className='info-item'>
                <label>Group Name</label>
                <input type='text' value={name} onChange={(e) => this.updateState('name', e.target.value)} />
              </div>
              <div className='info-item'>
                <label>Group Description</label>
                <input type='text' style={{width: 400}} value={description} onChange={(e) => this.updateState('description', e.target.value)} />
              </div>
              <div className='info-item'>
                <label>Group Thumbnail</label>
                <input type='text' style={{width: 400}} value={thumb} onChange={(e) => this.updateState('thumb', e.target.value)} />
              </div>
              <div className='info-item'>
                <label className='info-label'>Playlist Group Password</label>
                <input type='text' value={password} onChange={(e) => this.updateState('password', e.target.value)} />
              </div>
            </div>
            <button onClick={this.onSaveGridset}>SAVE Playlist Group</button>
            <div className='user-basic-info'>
                <div className='info-item'>
                  <label>GSPN</label>
                  <select onChange={this.onGridsetSelect}>
                    <option value = '-1'>Please select the playlist</option>
                    {
                      allPlaylists.map(({gspn, title}, index) => (
                        <option key={index} value={index}> {gspn}#{title} </option>
                      ))
                    }
                  </select>
                  <button onClick={this.onNewPlaylist}>Add new Playlist to Group</button>
                </div>
              </div>
            <ReactTable
              data={playlistData}
              sortable={false}
              columns={playlist_columns}
              defaultPageSize={10}
              showPaginationTop={false}
              className="-striped -highlight"
            />
          </div>
        }
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addGridset: bindActionCreators(addGridset, dispatch),
  fetchAllGridsets: bindActionCreators(fetchAllGridsets, dispatch),
  fetchGridset: bindActionCreators(fetchGridset, dispatch),
  updateGridset: bindActionCreators(updateGridset, dispatch),
  disableGridset: bindActionCreators(disableGridset, dispatch),
  getGridsetTitle: bindActionCreators(getGridsetTitle, dispatch),
  fetchAllPlaylists :  bindActionCreators(fetchAllPlaylists, dispatch),
  removePlaylist : bindActionCreators(removePlaylist, dispatch),
  addPlaylist : bindActionCreators(addPlaylist, dispatch),
  showOverlaySpinner : bindActionCreators(showOverlaySpinner, dispatch),
  hideOverlaySpinner : bindActionCreators(hideOverlaySpinner, dispatch),
  removeGridset : bindActionCreators(removeGridset, dispatch),
  swapPlaylistOrder : bindActionCreators(swapPlaylistOrder, dispatch),
  setGridsetPassword : bindActionCreators(setGridsetPassword, dispatch),
  updateGridsetVisibility : bindActionCreators(updateGridsetVisibility, dispatch),
})

export default connect(null, mapDispatchToProps)(Gridsets);
