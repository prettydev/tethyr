import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
//import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';

import SaleGridsets from './components/Gridsets'
// import SalePlaylists from './components/Playlists'

import images from '../../../../../../constants/images';

const styles = theme => ({
  root: {
    padding: theme.spacing(2, 0),
  },
  link: {
    display: 'flex',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
  tableRoot: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
});

class Sale extends Component {
  constructor(props) {
    super(props);

    this.state = {
      crumb : 0,
      gridset_id : 0,
      gridset_title : '',
    };
  }

  setLink = (value, event) => {
    event.preventDefault();
    this.setState({
      crumb : value,
    })
  }

  editGridset = (id, gridset) => {
    this.setState({
      crumb : 1,
      gridset_id : id,
      gridset_title : gridset,
    })
  }

  render() {
    const { crumb } = this.state;
    const { classes } = this.props;
    return (
      <React.Fragment>
        {(crumb === 0) &&
          <React.Fragment>
            <Paper elevation={0} className={classes.root}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Typography color="inherit" className={classes.link}>
                  <SearchIcon className={classes.icon} />
                  Find Stuff
                </Typography>
                <Typography
                  color="textPrimary"
                  className={classes.link}
                >
                  <img src={images.m_icon_pgroup} className={classes.icon}  alt="group icon" />
                  Playlists for sale
                </Typography>
              </Breadcrumbs>
            </Paper>
            <SaleGridsets 
              editGridset = {this.editGridset}
            />
          </React.Fragment>
        }
        {/* {(crumb === 1) &&
          <React.Fragment>
            <Paper elevation={0} className={classes.root}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link color="inherit" href="" onClick={(event) => this.setLink(0, event)} className={classes.link}>
                  <SearchIcon className={classes.icon} />
                  Find Stuff
                </Link>
                <Link color="inherit" href="" onClick={(event) => this.setLink(0, event)} className={classes.link}>
                  <img src={images.m_icon_pgroup} className={classes.icon} />
                  Public Playlist Groups
                </Link>
                <Typography
                  color="textPrimary"
                  className={classes.link}
                >
                  <img src={images.m_icon_pgroup} className={classes.icon} />
                  {gridset_title}
                </Typography>
              </Breadcrumbs>
            </Paper>
            <PublicPlaylists 
              gridset_id = {gridset_id}
              gridset_title = {gridset_title}
            />
          </React.Fragment>
        } */}
      </React.Fragment>
    );
  }
};

Sale.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Sale);