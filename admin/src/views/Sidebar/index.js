import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import PerfectScrollbar from "perfect-scrollbar";
import cx from "classnames";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

import sidebarStyle from "../../assets/jss/material-dashboard-pro-react/components/sidebarStyle.jsx";

import routes from "../../routes";

var ps;

class SidebarWrapper extends Component {
    componentDidMount() {
        if (navigator.platform.indexOf("Win") > -1) {
            ps = new PerfectScrollbar(this.refs.sidebarWrapper, {
                suppressScrollX: true,
                suppressScrollY: false
            });
        }
    }
    componentWillUnmount() {
        if (navigator.platform.indexOf("Win") > -1) {
            ps.destroy();
        }
    }
    render() {
        const { className, headerLinks, links } = this.props;
        return (
            <div className={className} ref="sidebarWrapper">
                {headerLinks}
                {links}
            </div>
        );
    }
}

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            miniActive: false
        };
        this.activeRoute.bind(this);
    }
    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? true : false;
    }
    render() {
        const {
            classes,
        } = this.props;
        const color = 'white';
        const bgColor = 'blue';
        var links = (
            <List className={classes.list}>
                {routes.map((prop, key) => {
                    if (prop.redirect) {
                        return null;
                    }
                    const navLinkClasses =
                        classes.itemLink +
                        " " +
                        cx({
                            [" " + classes[color]]: this.activeRoute(prop.path)
                        });
                    const itemText =
                        classes.itemText +
                        " " +
                        cx({[classes.itemTextMini]: this.state.miniActive});
                    const itemIcon = classes.itemIcon;
                    return (
                        <ListItem key={key} className={classes.item}>
                            <NavLink to={prop.path} className={navLinkClasses}>
                                <ListItemIcon className={itemIcon}>
                                    {typeof prop.icon === "string" ? (
                                        <Icon>{prop.icon}</Icon>
                                    ) : (
                                            <prop.icon />
                                        )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={prop.name}
                                    disableTypography={true}
                                    className={itemText}
                                />
                            </NavLink>
                        </ListItem>
                    );
                })}
            </List>
        );
        return (
            <div ref="mainPanel">
                <Drawer
                    anchor="left"
                    variant="permanent"
                    open
                    classes={{
                        paper: classes.drawerPaper + " " + classes[bgColor + "Background"]
                    }}
                >
                    <SidebarWrapper
                        className={classes.sidebarWrapper}
                        links={links}
                    />
                </Drawer>
            </div>
        )
    }
}

export default withRouter(withStyles(sidebarStyle)(Sidebar));
