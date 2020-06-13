import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import PlaylistAddOutlinedIcon from '@material-ui/icons/PlaylistAddOutlined';
import SubscriptionsOutlinedIcon from '@material-ui/icons/SubscriptionsOutlined';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { Button } from '@material-ui/core';

import images from '../../../../../../../constants/images';

import { takePublicPlaylist, updateManagementState } from '../../../../../../../actions/index';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
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
  subtitle: {
    position: 'absolute',
    top: 120,
    right: 16,
    color: 'grey',
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class PublicPlaylists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridset_id : props.gridset_id,
      gridset_title : props.gridset_title,
      pageSize : 20,
      open : false,
      playlist_id : -1,
      playlist_title : '',
      userAllGridsets : [],
      userGridset: '',
    }
  }

  onChangeRowsPerPage = (event) => {
    this.setState({
      pageSize : event,
    })
  }

  handleOpen = (id, title) => {
    const user_id = sessionStorage.getItem('userId');
    new Promise((resolve, reject) => {
      let url = `${process.env.REACT_APP_SERVER_URL}/user/gridset/getUserGridset/${user_id}/all/1`;
      fetch(url)
        .then(response => response.json())
        .then(result => {
          this.setState({
            userAllGridsets : result.data,
            open : true,
            playlist_id : id,
            playlist_title : title,
          })
        })
    })
  };

  handleClose = () => {
    this.setState({
      open : false,
      playlist_id : -1,
      playlist_title : '',
    })
  };

  handleChange = event => {
    this.setState({userGridset: event.target.value});
  };

  addPlaylist = () => {
    const user_id = sessionStorage.getItem('userId');
    const {playlist_id, userGridset } = this.state;
    const { takePublicPlaylist, updateManagementState } = this.props;
    takePublicPlaylist(user_id, userGridset, playlist_id)
    .then(({success}) => {
      if(success) {
        updateManagementState();
        this.setState({
          open: false,
        })
      }
      else
        alert('The playlist already exist in your playlist group!')
    })
    .catch(err => {console.log(err);})
  }

  render() {
    const { classes } = this.props;
    const { pageSize, gridset_id, gridset_title, open, playlist_title, userAllGridsets, userGridset } = this.state;
    return (
      <React.Fragment>
        <MaterialTable
          title={
            <div className={classes.title}>
              <img className={classes.badgeImage} src={images.m_icon_pgroup} alt="Playlist Group" />
              <p>{gridset_title}</p>
            </div>
          }
          options={{
            sorting: false,
            draggable: false,
            actionsColumnIndex: 5,
            pageSize: pageSize,
            rowStyle: {
              '&:hover': { color :'#EEE' }
            }
          }}
          onChangeRowsPerPage = {this.onChangeRowsPerPage}
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
          ]}
          onRowClick={((evt, selectedRow) => this.props.editPlaylist(selectedRow.id, selectedRow.title))}
          data={query =>
            new Promise((resolve, reject) => {
              let url = `${process.env.REACT_APP_SERVER_URL}/user/playlist/getPublicPlaylists/${gridset_id}`;
              url += `/${query.pageSize}`;
              url += `/${(query.page + 1)}`;
              fetch(url)
                .then(response => response.json())
                .then(result => {
                  resolve({
                    data: result.data,
                    page: result.page - 1,
                    totalCount: result.total,
                  })
                })
            })
          }
          actions={[
            {
              icon: () => (
                <PlaylistAddOutlinedIcon />
              ),
              tooltip: 'Take this playlist',
              onClick: (event, rowData) => this.handleOpen(rowData.id, rowData.title),
            }
          ]}
        />
        <p className={classes.subtitle}>M-1-2</p>
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
              <div>
                <p>Take Playlist:</p>
                <br />
                <h3>{playlist_title}</h3>
                <FormControl className={classes.formControl}>
                  <NativeSelect
                    className={classes.selectEmpty}
                    value={userGridset}
                    name="gridsets"
                    onChange={this.handleChange}
                    inputProps={{ 'aria-label': 'gridsets' }}
                  >
                    <option value="" disabled>
                      Select the destination Playlist Group
                    </option>
                    {
                      userAllGridsets.map((gridset, index) => 
                        <option value={gridset.id} key={index}>{gridset.name}</option>
                      )
                    }
                  </NativeSelect>
                </FormControl>
              </div>
              <br />
              <Button variant="contained" color="secondary" onClick={this.addPlaylist}>SUBMIT</Button>
            </div>
          </Fade>
        </Modal>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  takePublicPlaylist: bindActionCreators(takePublicPlaylist, dispatch),
  updateManagementState: bindActionCreators(updateManagementState, dispatch),
})

function mapStateToProps(state) {
  return {
    updateManagement: state.updateManagement,
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PublicPlaylists));