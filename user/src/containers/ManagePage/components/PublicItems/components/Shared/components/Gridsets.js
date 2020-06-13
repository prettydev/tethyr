import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import images from '../../../../../../../constants/images';

import { updateManagementState, findStuffScreen } from '../../../../../../../actions/index';

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
    top: 125,
    right: 16,
    color: 'grey',
  }
});

class SharedGridsets extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      pageSize : 20,
      updateManagement: props.updateManagement,
      screen: props.findStuff.screen,
    }
    this.tableRef = React.createRef();
  }

  componentDidMount() {
    this._isMounted = true;
  
    if (this._isMounted) {
      this.setState({
        updateManagement: this.props.updateManagement,
        screen: this.props.findStuff.screen,
      })
    }
  }

  componentDidUpdate() {
    if(this.state.updateManagement !== this.props.updateManagement) {
      this.tableRef.current && this.tableRef.current.onQueryChange();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = event => {
    const value = event.target.value;
    const { findStuffScreen } = this.props;
    findStuffScreen(value);
  };

  render() {
    const { classes } = this.props;
    const { pageSize, screen } = this.state;
    return (
      <React.Fragment>
        <MaterialTable
          title={
            <div className={classes.title}>
              <img className={classes.badgeImage} src={images.m_icon_pgroup} alt="Playlist Groups"/>
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
          columns={[
            { title: 'ID', field: 'id' },
            { title: 'List/Group Name', field: 'name', editable: 'onUpdate' },
            { title: 'List/Group Description', field: 'description' },
            { title: 'Author(s)', field: 'author' },
            { title: 'Last Updated', field: 'last_update' },
          ]}
        />
        <p className={classes.subtitle}>M-1-1</p>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateManagementState: bindActionCreators(updateManagementState, dispatch),
  findStuffScreen: bindActionCreators(findStuffScreen, dispatch),
})

function mapStateToProps(state) {
  return {
    updateManagement: state.updateManagement,
    findStuff: state.findStuff,
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SharedGridsets));