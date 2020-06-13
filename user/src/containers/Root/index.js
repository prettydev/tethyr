import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MobileFooter from "./components/MobileFooter";
import Routes from "./routes";
import OverlaySpinner from "../../components/OverlaySpinner";
import NotificationMessage from "../../components/NotificationMessage";
import { authenticateUser } from "../../redux/actions/user";
import {
  showNotificationMessage,
  //hideNotificationMessage,
  NotificationColorMode,
  NotificationPosition,
  ResentLink,
} from "../../redux/actions/notificationMessage";

import "./styles/styles.css";

/**
 * Root component, containing routes
 */

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: false,
      loggingIn: props.user.loggingIn,
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (!user.loggedIn) {
      const token = localStorage.getItem("_token");
      if (token) {
        this.props.dispatch(authenticateUser(token));
      } else {
        this.setState({
          isChecked: true,
        });
      }
    }
  }

  componentDidUpdate() {
    const { user, location } = this.props;

    if (user.loggedIn && sessionStorage.getItem("sharedRedirectTo")) {
      const sharedRedirectTo = sessionStorage.getItem("sharedRedirectTo");
      sessionStorage.setItem("sharedRedirectTo", "");
      this.props.history.push(sharedRedirectTo);
    } else {
      if (!this.state.isChecked && !user.loggingIn) {
        this.setState(
          {
            isChecked: true,
          },
          () => {
            if (user.loggedIn && location.pathname === "/") {
              if (user.user.status === "Active") {
                this.props.history.push("/viewer");
              } else if (user.user.status === "Unconfirmed") {
                this.props.history.push("/tour");
                this.props.dispatch(
                  showNotificationMessage(
                    "Please confirm your email and we will active your account!",
                    NotificationColorMode.green,
                    NotificationPosition.top,
                    ResentLink.on
                  )
                );
              }
            } else {
              this.props.history.push("/");
            }
          }
        );
      }
      if (this.state.loggingIn !== this.props.user.loggingIn) {
        if (this.state.isChecked && user.loggedIn) {
          if (location.pathname === "/") {
            if (user.user.status === "Active") {
              this.setState(
                {
                  loggingIn: this.props.user.loggingIn,
                },
                () => {
                  this.props.history.push("/viewer");
                }
              );
            } else if (user.user.status === "Unconfirmed") {
              this.setState(
                {
                  loggingIn: this.props.user.loggingIn,
                },
                () => {
                  this.props.history.push("/tour");
                  this.props.dispatch(
                    showNotificationMessage(
                      "Please confirm your email and we will active your account!",
                      NotificationColorMode.green,
                      NotificationPosition.top,
                      ResentLink.on
                    )
                  );
                }
              );
            } else {
              this.setState({
                loggingIn: this.props.user.loggingIn,
              });
            }
          }
        } else {
          this.setState({
            loggingIn: this.props.user.loggingIn,
          });
        }
      }
    }
  }

  render() {
    const {
      history,
      location,
      notificationMessage,
      overlaySpinner,
    } = this.props;
    const shouldShowHeader =
      !location.pathname.includes("viewer") &&
      !location.pathname.includes("manage") 
      && !(location.pathname=='/')
    const shouldShowFooter =
      !location.pathname.includes("viewer") &&
      !location.pathname.includes("manage") 
      && !(location.pathname=="/")
    const shouldTakeFullHeight =
      location.pathname.includes("viewer") ||
      location.pathname.includes("manage") 
      || (location.pathname=="/")

    
    return (
      <div
        id="app"
        className={classNames("app", "header-fixed", {
          notification: notificationMessage.visible,
        })}
      >
        {this.state.isChecked && (
          <div>
            {/* Header */}
            {shouldShowHeader && (
              <Header history={history} pathName={location.pathname} />
            )}
            {/* Body */}
            <div
              className={classNames("app-body", {
                "full-height": shouldTakeFullHeight,
              })}
            >
              <Routes />
              {location.pathname.includes("viewer") && (
                <OverlaySpinner visible={overlaySpinner.visible} />
              )}
            </div>
            {/* Footer */}
            {shouldShowFooter && (
              <Fragment>
                <Footer history={history} />
                <MobileFooter />
              </Fragment>
            )}
          </div>
        )}
        {notificationMessage.visible && <NotificationMessage />}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    overlaySpinner: state.overlaySpinner,
    notificationMessage: state.notificationMessage,
  };
}

export default connect(mapStateToProps)(Root);
