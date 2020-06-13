import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import RemoveIcon from '@material-ui/icons/Remove';
import PersonIcon from '@material-ui/icons/Person';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import SubscriptionsOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import SwapModal from './SwapModal';
import images from '../../../../../../constants/images'
import plist_move_icon from '../../../../../../assets/images/management/m_icon_plist_move.png'

import { createNewPlaylist, addNewToPlaylist, removePlaylist, editUserPlaylist } from '../../../../../../actions/index'
import { getUserAllGridset } from '../../../../../../services/userGridset'
import { moveUserPlaylist } from '../../../../../../services/userPlaylist'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  button: {
    margin: theme.spacing(3),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    textAlign: 'center',
  },
  swapModal: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    textAlign: 'center',
    height: '100%',
    width: '100%',
  },
  subtitle: {
    position: 'absolute',
    top: 120,
    right: 16,
    color: 'grey',
  },
  title: {
    display: 'flex',
    '& p': {
      paddingLeft: 10,
      lineHeight: 2,
    }
  },
  badgeImage: {
    width: 25,
    height: 25,
  },
});

class UserPlaylists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open : false,
      swapModalOpen : false,
      editModalOpen : false,
      moveModalOpen: false,
      pageSize : 20,
      gridset_id : props.gridset_id,
      gridset_title : props.gridset_title,
      titleError : false,
      descriptionError : false,
      newTitle : '',
      //newDescription : '',
      editPlaylistId: -1,
      editTitle: '',
      editDescription: '',
      updateManagement: props.updateManagement,
      move_playlist_id: -1,
      move_playlist_title: '',
      allGridsets: [],
      destination_gridset: 0,
      newDescription : '',
      editPassword:''
    };

    this.tableRef = React.createRef();
  }

  componentDidUpdate() {
    if(this.state.updateManagement !== this.props.updateManagement) {
      this.tableRef.current && this.tableRef.current.onQueryChange();
    }
  }

  onChangeRowsPerPage = (event) => {
    this.setState({
      pageSize : event,
    })
  }

  handleOpen = () => {
    this.setState({
      open : true,
    })
  };

  handleClose = () => {
    this.setState({
      open : false,
    })
  };

  removePlaylist = (gspn) => {
    const { removePlaylist } = this.props;
    const { gridset_id } = this.props;
    removePlaylist(gspn, gridset_id)
    .then(() => {
      this.tableRef.current && this.tableRef.current.onQueryChange();
    })
    .catch(err => {
      console.log(err);
    })
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name] : value,
    })
  }

  createPlaylist = () => {
    clearTimeout(this.timer);
    const { newTitle, newDescription, gridset_id } = this.state;
    const { createNewPlaylist, addNewToPlaylist } = this.props;
    if(!newTitle)
    {
      this.setState({
        titleError : true,
        descriptionError : false,
      })
      this.timer = setTimeout(() => {
        this.setState({
          titleError : false
        })
      }, 3000);
    }
    else if(!newDescription)
    {
      this.setState({
        titleError : false,
        descriptionError : true
      })
      this.timer = setTimeout(() => {
        this.setState({
          descriptionError : false
        })
      }, 3000);
    }
    else {
      createNewPlaylist(newTitle, newDescription)
      .then((res) => {
        if(res.success) {
          addNewToPlaylist(res.gspn, gridset_id)
              .then((res) => {
                this.setState({
                  open : false,
                  titleError : false,
                  descriptionError : false,
                  newTitle: '',
                  newDescription: '',
                });
                alert(`The new playlist ${newTitle} was created`);
                this.tableRef.current && this.tableRef.current.onQueryChange();
              })
              .catch((err) => { console.log(err); })
        }
        else {
          alert('The Playlist with that name already exists!')
        }
      })
      .catch(err => console.log(err))
    }
  }

  handleSwapModalOpen = () => {
    this.setState({
      swapModalOpen : true,
    })
  };

  handleSwapModalClose = () => {
    this.setState({
      swapModalOpen : false,
    })
  };

  handleEditModalOpen = (data) => {
    console.log(data)
 
    this.setState({
      editModalOpen : true,
      editPlaylistId: data.id,
      editTitle: data.title,
      editDescription: data.description,
      editPassword:data.password
    })
  };

  handleEditModalClose = () => {
    this.setState({
      editModalOpen : false,
      editTitle : '',
      editDescription : '',
      editPassword:''
    })
  };

  handleMoveModalOpen = (playlist_id, playlist_title) => {
    const { user } = this.props.user;
    getUserAllGridset(user.user_id, user.token, 'all', 1)
    .then(({data}) => {
      this.setState({
        moveModalOpen: true,
        move_playlist_id: playlist_id,
        move_playlist_title: playlist_title,
        allGridsets: data,
      })
    })
    .catch(err => console.log(err))
  }

  handleMoveModalClose = () => {
    this.setState({
      moveModalOpen: false,
      move_playlist_id: -1,
      move_playlist_title: '',
      destination_gridset: 0,
    })
  }

  editUserPlaylist = (id) => {
    clearTimeout(this.timer);
    const { editTitle, editDescription,editPassword } = this.state;
    
    const { editUserPlaylist } = this.props;
    
    if(!editTitle || !editDescription)
    {
      alert('The title or description can\'t be empty!');
    }
    else {
      editUserPlaylist(id, editTitle, editDescription,editPassword)
      .then(({success}) => {
        if(success) {
          this.setState({
            editModalOpen : false,
            editTitle : '',
            editDescription : '',
            editPassword:''
          });
          this.tableRef.current && this.tableRef.current.onQueryChange();
        }
        else {
          alert('The Playlist with that name already exists!')
        }
      })
    }
  }

  updatePlaylistTable = () => {
    this.tableRef.current && this.tableRef.current.onQueryChange();
    this.setState({
      swapModalOpen: false,
    })
  }

  handleDestinationGridset = (event) => {
    console.log(event.target.value)
    this.setState({
      destination_gridset: event.target.value,
    })
  }

  handleMovePlaylist = (move_option) => {
    const { user } = this.props.user;
    const { move_playlist_id, destination_gridset, allGridsets, gridset_id } = this.state;
    const destination_gridset_id = allGridsets[destination_gridset].id;
    moveUserPlaylist(user.user_id, user.token, gridset_id, destination_gridset_id, move_playlist_id, move_option)
    .then((response) => {
      if(response.success) {
        alert('Success!!!')
        this.tableRef.current && this.tableRef.current.onQueryChange();
        this.setState({
          moveModalOpen: false,
          move_playlist_id: -1,
          move_playlist_title: '',
          destination_gridset: 0,
        })
      }
      else {
        alert(response.message)
        this.tableRef.current && this.tableRef.current.onQueryChange();
        this.setState({
          moveModalOpen: false,
          move_playlist_id: -1,
          move_playlist_title: '',
          destination_gridset: 0,
        })
      }
    })
    .catch(err => console.log(err))
  }

  render() {
    const user_id = sessionStorage.getItem('userId');
    const { classes } = this.props;
    const { pageSize, gridset_id, gridset_title, open, titleError, descriptionError, newTitle, newDescription, swapModalOpen, editModalOpen, editPlaylistId, editTitle, editDescription, moveModalOpen, move_playlist_title, allGridsets, destination_gridset,editPassword } = this.state;
    return (
      <React.Fragment>
        <MaterialTable
          title={
            <div className={classes.title}>
              <img className={classes.badgeImage} src={images.m_icon_pgroup} alt="Playlist" />
              <p>{gridset_title}</p>
            </div>
          }
          options={{
            sorting: false,
            draggable: false,
            actionsColumnIndex: 7,
            pageSize: pageSize,
            rowStyle: {
              '&:hover': { color :'#EEE' }
            }
          }}
          onChangeRowsPerPage = {this.onChangeRowsPerPage}
          tableRef={this.tableRef}
          columns={[
            { title: 'ID', 
              field: 'id',
              render: rowData =>
              <div className={classes.title}>
                <SubscriptionsOutlinedIcon className={classes.badgeImage} />
                <p>{rowData.id}</p>
              </div>
            },
            { title: 'List/Group Name', field: 'title' },
            { title: 'List/Group Description', field: 'description' },
            { title: 'Author(s)', field: 'author' },
            { title: 'Last Updated', field: 'last_update' },
            {
              title: '',
              field: 'owned',
              render: rowData =>
                (`${rowData.owner}` === user_id)
                ?
                <PersonIcon />
                :
                null
              ,
              disableClick: true,
              cellStyle: {
                padding: 0,
                textAlign: 'center',
                width: 25,
                paddingRight:20,
              }
            },
            {
              title: '',
              field: 'edit',
              render: rowData =>
                (`${rowData.owner}` === user_id)
                ?
                <div className={classes.edit}>
                  <img src={images.m_icon_edit_title} onClick={() => this.handleEditModalOpen(rowData)} style={{width: 25}} alt="edit" />
                </div>
                :
                null
              ,
              disableClick: true,
              cellStyle: {
                padding: 0,
                textAlign: 'center',
                width: 25,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                }
              }
            },
          ]}
          data={query =>
            new Promise((resolve, reject) => {
              let url = `${process.env.REACT_APP_SERVER_URL}/user/playlist/getUserPlaylist/${user_id}/${gridset_id}`;
              url += `/${query.pageSize}`;
              url += `/${(query.page + 1)}`;
              fetch(url)
                .then(response => response.json())
                .then(result => {
                  if(result.total === 0) {
                    resolve({
                      data: [],
                      page: 0,
                      totalCount: 0,
                    })
                  }
                  else {
                    resolve({
                      data: result.data,
                      page: result.page - 1,
                      totalCount: result.total,
                    })
                  }
                })
            })
          }
          onRowClick={((evt, selectedRow) => this.props.editPlaylist(selectedRow.id, selectedRow.title))}
          actions={[
            {
              icon: () => (
                <SwapVertIcon color="secondary"/>
              ),
              tooltip: 'swap the playlist group order',
              onClick: (event) => this.handleSwapModalOpen()
            },
            rowData =>({
              icon: () => (
                <img src={plist_move_icon} className={classes.badgeImage} alt="user playlist"/>
              ),
              tooltip: 'Move/Copy this playlist to the other group',
              onClick: (event) => this.handleMoveModalOpen(rowData.id, rowData.title)
            }),
            {
              icon: () => (
                <RemoveIcon />
              ),
              tooltip: 'Remove this playlist',
              onClick: (event, rowData) => this.removePlaylist(rowData.gspn)
            },
            {
              icon: () => (
                <PlaylistAddIcon />
              ),
              tooltip: 'Create New Playlist',
              isFreeAction: true,
              onClick: (event) => this.handleOpen()
            }
          ]}
        />
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
            <form className={classes.root} noValidate autoComplete="off">
              <Input name="newTitle" onChange = {this.handleChange} value = {newTitle} placeholder="New Playlist Title..." inputProps={{ 'aria-label': 'description' }} error={titleError ? true : false} style={{width: '100%', marginBottom: 50}} />
              <Input name="newDescription" onChange = {this.handleChange} value = {newDescription} placeholder="Playlist Description..." inputProps={{ 'aria-label': 'description' }} error={descriptionError ? true : false} style={{width: '100%', marginBottom: 20}} />
              <Button variant="contained" color="secondary" className={classes.button} onClick = {this.createPlaylist} >Create New Playlist</Button>
            </form>
            </div>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={swapModalOpen}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={swapModalOpen}>
            <div className={classes.swapModal}>
              <SwapModal
                gridset_id = {gridset_id}
                updatePlaylistTable = {this.updatePlaylistTable}
                handleSwapModalClose = {this.handleSwapModalClose}
              />
            </div>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={editModalOpen}
          onClose={this.handleEditModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >

            <div className={classes.paper}>
              <form className={classes.root} noValidate autoComplete="off">
                <label style={{float:"left"}}>Title</label>
                <Input name="editTitle" id="editTitle" onChange={this.handleChange} value={editTitle} placeholder="Playlist Title..." inputProps={{ 'aria-label': 'description' }} style={{width: '100%', marginBottom: 20}} />
                <label style={{float:"left"}}>Description</label>
                <Input name="editDescription" id="editDescription" onChange={this.handleChange} value={editDescription} placeholder="Playlist Description..." inputProps={{ 'aria-label': 'description' }} style={{width: '100%', marginBottom: 20}} />
                <label style={{float:"left"}}>Password</label>
                <Input name="editPassword" id="editPassword" onChange={this.handleChange} value={editPassword} ype="text" pattern="\d*" maxLength="4" placeholder="Playlist Password..." style={{width: '100%', marginBottom: 20}} />
                <Button variant="contained" color="secondary" className={classes.button} onClick = {() => this.editUserPlaylist(editPlaylistId)} >Save</Button>
                <Button variant="contained" color="secondary" className={classes.button} onClick = {this.handleEditModalClose} >Cancel</Button>
              </form>
            </div>
          
        </Modal>
        <Modal
          aria-labelledby="Move/Copy User Playlist"
          aria-describedby="Move/Copy User Playlist"
          className={classes.modal}
          open={moveModalOpen}
          onClose={this.handleMoveModalClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={moveModalOpen}>
            <div className={classes.paper}>
              <p>Move/Copy Playlist</p>
              <p>Playlist Title"</p>
              <p>{move_playlist_title}</p>
              <p>Select the Destination Playlist Group:</p>
              <select value={destination_gridset} onChange={this.handleDestinationGridset}>
                {
                  allGridsets.map(({id, name}, idx) => 
                    <option key={idx} value={idx}>{name}</option>
                  )
                }
              </select>
              <div>
                <Button variant="contained" color="secondary" className={classes.button} onClick = {() => this.handleMovePlaylist('move')} >Move</Button>
                <Button variant="contained" color="secondary" className={classes.button} onClick = {() => this.handleMovePlaylist('copy')} >Copy</Button>
                <Button variant="contained" color="secondary" className={classes.button} onClick = {this.handleMoveModalClose} >Cancel</Button>
              </div>
            </div>
          </Fade>
        </Modal>
        <p className={classes.subtitle}>M-2-2</p>
      </React.Fragment>
    )
  }
};

const mapDispatchToProps = (dispatch) => ({
  createNewPlaylist: bindActionCreators(createNewPlaylist, dispatch),
  addNewToPlaylist: bindActionCreators(addNewToPlaylist, dispatch),
  removePlaylist: bindActionCreators(removePlaylist, dispatch),
  editUserPlaylist: bindActionCreators(editUserPlaylist, dispatch),
})

function mapStateToProps(state) {
  return {
    user: state.user,
    updateManagement: state.updateManagement,
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UserPlaylists));