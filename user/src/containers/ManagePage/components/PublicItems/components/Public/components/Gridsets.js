import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import QueueIcon from '@material-ui/icons/Queue';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import images from '../../../../../../../constants/images';

import { takePublicGridset, updateManagementState, findStuffScreen } from '../../../../../../../actions/index';

const lists = [
  {
    value: 'public',
    label: 'Public Playlist Groups',
  },
  {
    value: 'promoted',
    label: 'Shared with you',
  },
  {
    value: 'sale',
    label: 'Playlists for sale',
  }
];

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  title: {
    display: 'flex',
    '& p': {
      paddingLeft: theme.spacing(1),
    }
  },
  existIcon: {
    color: "#3917ef",
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
  }
});

class PublicGridsets extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      pageSize : 20,
      updateManagement: false,
      screen: '',
    }
    this.tableRef = React.createRef();
  }

  componentDidMount() {
    this._isMounted = true;
  
    if (this._isMounted) {
      this.setState({
        updateManagement: this.props.updateManagement.state,
        screen: this.props.findStuff.screen,
      })
    }
  }

  componentDidUpdate() {
    if(this.state.updateManagement !== this.props.updateManagement.state) {
      this.tableRef.current && this.tableRef.current.onQueryChange();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  takeGridset = (id) => {
    const user_id = sessionStorage.getItem('userId');
    const { takePublicGridset, updateManagementState } = this.props;
    takePublicGridset(user_id, id)
    .then(() => {
      this.tableRef.current && this.tableRef.current.onQueryChange();
      updateManagementState();
    })
    .catch(err => {console.log(err);})
  }

  onChangeRowsPerPage = (event) => {
    this.setState({
      pageSize : event,
    })
  }

  handleChange = event => {
    const value = event.target.value;
    const { findStuffScreen } = this.props;
    findStuffScreen(value);
  };

  render() {
    const { classes } = this.props;
    const { pageSize, screen } = this.state;
    const user_id = sessionStorage.getItem('userId');
    return (
      <React.Fragment>
        <MaterialTable
          title={
            <div className={classes.title}>
              <img className={classes.badgeImage} src={images.m_icon_pgroup} alt="Playlist Groups" />
              <TextField
                id="standard-select-currency"
                select
                value={screen}
                onChange={this.handleChange}
                style = {{
                  left: 10,
                }}
              >
              {lists.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
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
          tableRef={this.tableRef}
          columns={[
            { 
              title: 'ID',
              field: 'id',
              render: rowData =>
                <div className={classes.title}>
                  <img className={classes.badgeImage} src={images.m_icon_pgroup} alt="Playlist Groups" />
                  <p>{rowData.id}</p>
                </div>
            },
            { title: 'List/Group Name', field: 'name', editable: 'onUpdate' },
            { title: 'List/Group Description', field: 'description' },
            { title: 'Author(s)', field: 'author' },
            { title: 'Last Updated', field: 'last_update' },
            {
              title: '',
              field: 'taken',
              render: rowData => (rowData.exist) && (
                <MenuBookIcon id="exist" className={classes.existIcon} />
              ),
              disableClick: true,
              cellStyle: {
                padding: 0,
                textAlign: 'center',
                width: 25,
                paddingRight:20,
              },
            },
          ]}
          data={query =>
            new Promise((resolve, reject) => {
              let url = `${process.env.REACT_APP_SERVER_URL}/user/gridset/getPublicGridset/${user_id}`;
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
          onRowClick={((evt, selectedRow) => this.props.editGridset(selectedRow.id, selectedRow.name))}
          actions={[
            rowData => ({
              icon: () => (
                <QueueIcon />
              ),
              tooltip: 'Take this playlist group',
              hidden: (rowData.exist ? true : false),
              onClick: (event, rowData) => {
                this.takeGridset(rowData.id);
              },
            })
          ]}
        />
        <p className={classes.subtitle}>M-1-1</p>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  takePublicGridset: bindActionCreators(takePublicGridset, dispatch),
  updateManagementState: bindActionCreators(updateManagementState, dispatch),
  findStuffScreen: bindActionCreators(findStuffScreen, dispatch),
})

function mapStateToProps(state) {
  return {
    updateManagement: state.updateManagement,
    findStuff: state.findStuff,
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PublicGridsets));