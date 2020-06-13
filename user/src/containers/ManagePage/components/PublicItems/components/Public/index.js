import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import PublicGridsets from './components/Gridsets'
import PublicPlaylists from './components/Playlists'
import PublicItems from './components/Items'
import images from '../../../../../../constants/images';
import './styles.css';

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
  }
});

class Public extends Component {
  constructor(props) {
    super(props);

    this.state = {
      crumb : 0,
      gridset_id : 0,
      gridset_title : '',
      playlist_id : 0,
      playlist_title : '',
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

  editPlaylist = (id, playlist) => {
    this.setState({
      crumb : 2,
      playlist_id : id,
      playlist_title : playlist,
    })
  }

  render() {
    const { crumb, gridset_id, gridset_title, playlist_id, playlist_title } = this.state;
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
                  <img src={images.m_icon_pgroup} className={classes.icon}  alt="group icon"/>
                  Public Playlist Groups
                </Typography>
              </Breadcrumbs>
            </Paper>
            <PublicGridsets 
              editGridset = {this.editGridset}
            />
          </React.Fragment>
        }
        {(crumb === 1) &&
          <React.Fragment>
            <Paper elevation={0} className={classes.root}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link color="inherit" href="" onClick={(event) => this.setLink(0, event)} className={classes.link}>
                  <SearchIcon className={classes.icon} />
                  Find Stuff
                </Link>
                <Link color="inherit" href="" onClick={(event) => this.setLink(0, event)} className={classes.link}>
                  <img src={images.m_icon_pgroup} className={classes.icon}  alt="group icon"/>
                  Public Playlist Groups
                </Link>
                <Typography
                  color="textPrimary"
                  className={classes.link}
                >
                  <img src={images.m_icon_pgroup} className={classes.icon}  alt="group icon"/>
                  {gridset_title}
                </Typography>
              </Breadcrumbs>
            </Paper>
            <PublicPlaylists
              editPlaylist = {this.editPlaylist}
              gridset_id = {gridset_id}
              gridset_title = {gridset_title}
            />
          </React.Fragment>
        }
        {(crumb === 2) &&
          <React.Fragment>
            <Paper elevation={0} className={classes.root}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link color="inherit" href="" onClick={(event) => this.setLink(0, event)} className={classes.link}>
                  <SearchIcon className={classes.icon} />
                  Find Stuff
                </Link>
                <Link color="inherit" href="" onClick={(event) => this.setLink(0, event)} className={classes.link}>
                  <img src={images.m_icon_pgroup} className={classes.icon}  alt="group icon"/>
                  Public Playlist Groups
                </Link>
                <Link
                  color="inherit"
                  href = ""
                  onClick={(event) => this.setLink(1, event)}
                  className={classes.link}
                >
                  <img src={images.m_icon_pgroup} className={classes.icon}  alt="group icon"/>
                  {gridset_title}
                </Link>
                <Typography color={crumb === 2 ? "textPrimary" : "inherit"} className={classes.link}>
                  <img src={images.crumb_plist} className={classes.icon}  alt="group icon"/>
                  {playlist_title}
                </Typography>
              </Breadcrumbs>
            </Paper>
            <PublicItems
              playlist_id = {playlist_id}
              playlist_title = {playlist_title}
            />
          </React.Fragment>
        }
      </React.Fragment>
    );
  }
};

Public.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Public);