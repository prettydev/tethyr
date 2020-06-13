import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Input from '@material-ui/core/Input';
import Fade from '@material-ui/core/Fade';
import SwapVertIcon from '@material-ui/icons/SwapVert';
import Button from '@material-ui/core/Button';
import RemoveIcon from '@material-ui/icons/Remove';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PersonIcon from '@material-ui/icons/Person';
import LanguageIcon from '@material-ui/icons/Language';
import LockIcon from '@material-ui/icons/Lock';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import LinkIcon from '@material-ui/icons/Link';
import SwapModal from './SwapModal';
import config from '../../../../../../config/config'
import { removeGridset, updateManagementState, createUserGroup, setUserGridsetStatus, editUserGridset, setUserGridsetPermission } from '../../../../../../actions/index'
import { getUserGridsetSharedLink } from '../../../../../../services/userGridset';
import images from '../../../../../../constants/images'

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
  edit: {
    '&:hover': {
      cursor: 'pointer'
    }
  },
  tooltip: {
    cursor: 'pointer',
    '& .tooltiptext' : {
      visibility: 'hidden',
      width: 150,
      backgroundColor: 'grey',
      color: '#fff',
      textAlign: 'center',
      borderRadius: 6,
      padding: '5px 0',
      /* Position the tooltip */
      position: 'absolute',
      zIndex: 1,
    },
    '&:hover .tooltiptext' : {
      visibility: 'visible',
    }
  }
});

class UserGridsets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open : false,
      swapModalOpen : false,
      editModalOpen : false,
      pageSize : 20,
      titleError : false,
      descriptionError : false,
      newTitle : '',
      newDescription : '',
      updateManagement: props.updateManagement,
      editGridsetId: -1,
      editTitle: '',
      editDescription: '',
      editPassword:''
    };

    this.tableRef = React.createRef();

   
  }

  componentDidUpdate() {
    if(this.state.updateManagement !== this.props.updateManagement) {
      this.tableRef.current && this.tableRef.current.onQueryChange();
    }
  }

  removeGridset = (id, sort_id) => {
    const { removeGridset, updateManagementState } = this.props;
    removeGridset(id, sort_id)
    .then(() => {
      this.tableRef.current && this.tableRef.current.onQueryChange();
      updateManagementState();
    })
    .catch(err=> {console.log(err)})
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

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name] : value,
    })
  }

  createGroup = () => {

    const newTitle=document.getElementById("newTitle").value;
    const newDescription=document.getElementById("newDescription").value;
    clearTimeout(this.timer);
    // const { newTitle, newDescription } = this.state;
    const { createUserGroup, updateManagementState } = this.props;
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
      createUserGroup(newTitle, newDescription)
      .then(({success}) => {
        if(success) {
          this.setState({
            open : false,
            titleError : false,
            descriptionError : false
          });
          alert(`The new playlist group ${newTitle} was created`);
          updateManagementState();
          this.tableRef.current && this.tableRef.current.onQueryChange();
        }
        else {
          alert('The Playlist group with that name already exists!')
        }
      })
      .catch(err => console.log(err))
    }
  }

  handleEditModalOpen = (data) => {

    this.setState({
      editModalOpen : true,
      editGridsetId: data.id,
      editTitle: data.name,
      editDescription: data.description,
    })
  };

  handleEditModalClose = () => {
    this.setState({
      editModalOpen : false,
      editTitle : '',
      editDescription : '',
      editPassword : '',
    })
  };

  setGridsetStatus = (id, status) => {
    const update_status = status === 0 ? 1 : 0;
    const { setUserGridsetStatus } = this.props;
    setUserGridsetStatus(id, update_status)
    .then(() => {
      this.tableRef.current && this.tableRef.current.onQueryChange();
    })
    .catch((err) => { console.log(err);})
  }

  editUserGridset = (id) => {
    clearTimeout(this.timer);
    const { editTitle, editDescription, editPassword } = this.state;
    const { updateManagementState, editUserGridset } = this.props;
    if(!editTitle || !editDescription)
    {
      alert('The title or description can\'t be empty!');
    }
    else {
      editUserGridset(id, editTitle, editDescription,editPassword)
      .then(({success}) => {
        if(success) {
          this.setState({
            editModalOpen : false,
            editTitle : '',
            editDescription : '',
            editPassword:''
          });
          updateManagementState();
          this.tableRef.current && this.tableRef.current.onQueryChange();
        }
        else {
          alert('The Playlist group with that name already exists!')
        }
      })
    }
  }

  updateGridsetTable = () => {
    this.tableRef.current && this.tableRef.current.onQueryChange();
    this.setState({
      swapModalOpen: false,
    })
  }

  editPermission = (rowData) => {
    const user_id = this.props.user.user.user_id;
    if(parseInt(user_id) === rowData.owner) {
      const {setUserGridsetPermission} = this.props;
      setUserGridsetPermission(rowData.id)
      .then(() => {
        this.tableRef.current && this.tableRef.current.onQueryChange();
      })
      .catch((err) => {console.log(err);})
    }
    else {
      return null;
    }
  }

  handleShareGroup = (gridset_id) => {
    const user_id = this.props.user.user.user_id;
    const token = this.props.user.user.token;
    getUserGridsetSharedLink(user_id, gridset_id, token)
    .then(() => {
      this.tableRef.current && this.tableRef.current.onQueryChange();
    })
    .catch(err => console.log(err))
  }

  copySharedLink = (shared_id) => {
    var copyText = document.getElementById(`shared_group_link_${shared_id}`).innerHTML;
    var elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = copyText;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);

    /* Alert the copied text */
    alert("Copied the link: " + copyText);
  }

  render() {
    const { classes } = this.props;
    const { pageSize, open, titleError, descriptionError, swapModalOpen, editModalOpen, editGridsetId, editTitle, editDescription,editPassword } = this.state;
    const user_id = this.props.user.user.user_id;
    return (
      <React.Fragment>
        <MaterialTable
          title=""
          options={{
            sorting: false,
            draggable: false,
            actionsColumnIndex: 9,
            pageSize: pageSize,
            rowStyle: {
              '&:hover': { color :'#EEE' }
            }
          }}
          onChangeRowsPerPage = {this.onChangeRowsPerPage}
          tableRef={this.tableRef}
          columns={[
            { title: 'ID', field: 'id' },
            { title: 'List/Group Name', field: 'name' },
            { title: 'List/Group Description', field: 'description' },
            { title: 'Author(s)', field: 'author' },
            { title: 'Last Updated', field: 'last_update', disableClick: true },
            { title: 'Shared Link',
              field: 'shared_link',
              render: rowData =>
                (rowData.shared_status === 1)
                ?
                <div className={classes.tooltip}>
                  <p id={'shared_group_link_' + rowData.shared_id} onClick={() => this.copySharedLink(rowData.shared_id)}>
                    {window.location.origin + '/share/' + rowData.shared_id}
                  </p>
                  <span className="tooltiptext">Click to copy the link</span>
                </div>
                :
                null
              ,
              disableClick: true,
              cellStyle: {
                textAlign: 'center',
                width: 25,
              }
            },
            {
              title: 'Owned',
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
              title: 'Visibility',
              field: 'permission',
              render: rowData =>
                (rowData.visibility === 0)
                ?
                <LanguageIcon onClick={() => this.editPermission(rowData)}/>
                :
                <LockIcon onClick={() => this.editPermission(rowData)}/>
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
              let url = `${config.apiBaseUrl}/userGridset/getUserAllGridset/${user_id}`;
              url += `/${query.pageSize}`;
              url += `/${(query.page + 1)}`;
              fetch(url, {
                headers: {
                  'x-access-token': this.props.user.user.token
                }
              })
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
          onRowClick={((evt, selectedRow) => this.props.editGridset(selectedRow.id, selectedRow.name))}
          actions={[
            rowData =>({
              icon: () => (
                rowData.shared_status === 1 ?
                <LinkIcon color="secondary" />
                :
                <LinkIcon />
              ),
              tooltip: rowData.shared_status === 1 ? 'Remove the shared link' : 'Share this group',
              onClick: (event) => this.handleShareGroup(rowData.id)
            }),
            {
              icon: () => (
                <SwapVertIcon color="secondary"/>
              ),
              tooltip: 'swap the playlist group order',
              onClick: (event) => this.handleSwapModalOpen()
            },
            {
              icon: () => (
                <RemoveIcon />
              ),
              tooltip: 'Remove this playlist group',
              onClick: (event, rowData) => this.removeGridset(rowData.id, rowData.sort_id)
            },
            rowData =>({
              icon: () => (
                rowData.status === 1 ?
                <VisibilityIcon />
                :
                <VisibilityOffIcon />
              ),
              tooltip: rowData.status === 1 ? 'Make this Playlist Group as offline' : 'Make this Playlist Group as online',
              onClick: (event, rowData) => this.setGridsetStatus(rowData.id, rowData.status)
            }),
            {
              icon: () => (
                <PlaylistAddIcon />
              ),
              tooltip: 'Create New Playlist Group',
              isFreeAction: true,
              onClick: (event) => this.handleOpen()
            }
          ]}
        />
        <Modal
          aria-labelledby="newGroup"
          aria-describedby="create_new_group"
          className={classes.modal}
          open={open}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
            
            <div className={classes.paper}>
              <form className={classes.root} noValidate autoComplete="off">
                <Input name="newTitle" id="newTitle"  placeholder="New Group Title..." inputProps={{ 'aria-label': 'description' }} error={titleError ? true : false} style={{width: '100%', marginBottom: 50}} />
                <textarea name="newDescription"  id="newDescription" placeholder="Group Description..." inputProps={{ 'aria-label': 'description' }} error={descriptionError ? true : false} style={{width: '100%', marginBottom: 20}} />
                <Button variant="contained" color="secondary" className={classes.button} onClick = {this.createGroup} >Create New Playlist Group</Button>
              </form>
            </div>
         
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
                updateGridsetTable = {this.updateGridsetTable}
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
          <Fade in={editModalOpen}>
            <div className={classes.paper}>
              <form className={classes.root} noValidate autoComplete="off">
                <Input name="editTitle" onChange = {this.handleChange} value = {editTitle} placeholder="Group Title..." inputProps={{ 'aria-label': 'description' }} style={{width: '100%', marginBottom: 50}} />
                <Input name="editDescription" onChange = {this.handleChange} value = {editDescription} placeholder="Group Description..." inputProps={{ 'aria-label': 'description' }} style={{width: '100%', marginBottom: 20}} />
                <Input name="editPassword" onChange = {this.handleChange} value = {editPassword} type="number" max={9999} placeholder="Group Description..." inputProps={{ 'aria-label': 'description' }} style={{width: '100%', marginBottom: 20}} />
                <Button variant="contained" color="secondary" className={classes.button} onClick = {() => this.editUserGridset(editGridsetId)} >Save</Button>
                <Button variant="contained" color="secondary" className={classes.button} onClick = {this.handleEditModalClose} >Cancel</Button>
              </form>
            </div>
          </Fade>
        </Modal>
        <p className={classes.subtitle}>M-2-1</p>
      </React.Fragment>
    )
  }
};

const mapDispatchToProps = (dispatch) => ({
  removeGridset: bindActionCreators(removeGridset, dispatch),
  updateManagementState: bindActionCreators(updateManagementState, dispatch),
  createUserGroup: bindActionCreators(createUserGroup, dispatch),
  setUserGridsetStatus: bindActionCreators(setUserGridsetStatus, dispatch),
  editUserGridset: bindActionCreators(editUserGridset, dispatch),
  setUserGridsetPermission: bindActionCreators(setUserGridsetPermission, dispatch),
})

function mapStateToProps(state) {
  return {
    updateManagement: state.updateManagement,
    user: state.user,
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UserGridsets))