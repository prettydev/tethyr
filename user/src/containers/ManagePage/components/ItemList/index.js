import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SearchIcon from '@material-ui/icons/Search';

import UserItems from '../UserItems';
import PublicItems from '../PublicItems'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      <Box p={2}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function LinkTab(props) {
  return (
    <Tab
      component={Link}
      {...props}
    />
  );
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    marginTop: 35,
  },
  appBar: {
    position: 'fixed',
    zIndex: 99,
    '& a:hover': {
      color: 'inherit',
    }
  },
  tabPanel: {
    paddingTop: 75,
  }
});

class ItemList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      value: 0,
    };
  }

  componentDidMount() {
    if(this.props.location.pathname === '/manage/find_stuff') {
      this.setState({
        value: 0,
      })
    }
    else if(this.props.location.pathname === '/manage/your_stuff') {
      this.setState({
        value: 1,
      })
    }
    else {
      this.props.history.push('/manage/your_stuff')
      this.setState({
        value: 1,
      })
    }
  }

  handleChange = (event, newValue) => {
    this.setState({
      value: newValue,
    })
  };

  render() {
    const { value } = this.state;

    const { classes } = this.props;
    return (
      <div className={`${classes.root} `} style={{marginTop:"80px"}}>
        <AppBar position="static" className={classes.appBar}>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={this.handleChange}
            aria-label="playlist group manager"
          >
            <LinkTab icon={<SearchIcon />} label="Find Stuff" to="/manage/find_stuff" {...a11yProps(0)} />
            <LinkTab icon={<MenuBookIcon />} label="Your Stuff" to="/manage/your_stuff" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0} className={classes.tabPanel}>
          <PublicItems />
        </TabPanel>
        <TabPanel value={value} index={1} className={classes.tabPanel}>
          <UserItems />
        </TabPanel>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(ItemList));