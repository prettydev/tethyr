import React, { Component } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import routes from "config/routes";

import "./styles.css";

const SettingsMenuItem = {
  editProfile: "General",
  membership: "Membership Level",
  externalAccounts: "External Accounts",
  addCredits: "Payments and Ad Credits",
  redeemCredit: "Redeem Credit",
  contact: "Contact",
};

class SettingsMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeItem: this.getActiveSettingsMenu(props.location.pathname),
    };
  }

  componentWillReceiveProps({ location }) {
    this.setState({
      activeItem: this.getActiveSettingsMenu(location.pathname),
    });
  }

  getActiveSettingsMenu = (path) => {
    let activeItem = SettingsMenuItem.editProfile;

    if (path.includes("membership")) {
      activeItem = SettingsMenuItem.membership;
    } else if (path.includes("external_accounts")) {
      activeItem = SettingsMenuItem.externalAccounts;
    } else if (path.includes("add_credits")) {
      activeItem = SettingsMenuItem.addCredits;
    } else if (path.includes("editprofile")) {
      activeItem = SettingsMenuItem.editProfile;
    } else if (path.includes("redeem")) {
      activeItem = SettingsMenuItem.redeemCredit;
    } else {
      activeItem = SettingsMenuItem.redeemCredit;
    }

    return activeItem;
  };

  onClickMenu = (clickedMenuItem) => {
    if (this.state.activeItem === clickedMenuItem) {
      return;
    }

    switch (clickedMenuItem) {
      case SettingsMenuItem.editProfile:
        this.props.history.push("/settings/editprofile");
        break;
      case SettingsMenuItem.membership:
        this.props.history.push("/settings/membership");
        break;
      case SettingsMenuItem.addCredits:
        this.props.history.push("/settings/add_credits");
        break;
      case SettingsMenuItem.externalAccounts:
        this.props.history.push(routes.settings.externalAccounts());
        break;
      default:
        this.props.history.push("/settings/editprofile");
    }
  };

  render() {
    const { activeItem } = this.state;
    const isCompany = this.props.user.user.is_company;

    return (
      <div className="settings-menu">
        <div className="settings-menu-regular">
          <div
            className={classNames("settings-menu-item", "clickable", {
              "company-menu-item": isCompany,
            })}
            onClick={() => {
              this.onClickMenu(SettingsMenuItem.editProfile);
            }}
          >
            <div
              className={classNames("settings-menu-item-name", {
                active: activeItem === SettingsMenuItem.editProfile,
              })}
            >
              Account Details
            </div>
            {activeItem === SettingsMenuItem.editProfile && (
              <div className="settings-menu-item-underline" />
            )}
          </div>

          {!isCompany && (
            <div
              className={classNames("settings-menu-item", "clickable", {
                "company-menu-item": isCompany,
              })}
              onClick={() => {
                this.onClickMenu(SettingsMenuItem.membership);
              }}
            >
              <div
                className={classNames("settings-menu-item-name", {
                  active: activeItem === SettingsMenuItem.membership,
                })}
              >
                {SettingsMenuItem.membership}
              </div>
              {activeItem === SettingsMenuItem.membership && (
                <div className="settings-menu-item-underline" />
              )}
            </div>
          )}

          <div
            className={classNames("settings-menu-item", "clickable", {
              "company-menu-item": isCompany,
            })}
            onClick={() => {
              this.onClickMenu(SettingsMenuItem.externalAccounts);
            }}
          >
            <div
              className={classNames("settings-menu-item-name", {
                active: activeItem === SettingsMenuItem.externalAccounts,
              })}
            >
              {SettingsMenuItem.externalAccounts}
            </div>
            {activeItem === SettingsMenuItem.externalAccounts && (
              <div className="settings-menu-item-underline" />
            )}
          </div>

          <div
            className={classNames("settings-menu-item", "clickable", {
              "company-menu-item": isCompany,
            })}
            onClick={() => {
              this.onClickMenu(SettingsMenuItem.addCredits);
            }}
          >
            <div
              className={classNames("settings-menu-item-name", {
                active: activeItem === SettingsMenuItem.addCredits,
              })}
            >
              {SettingsMenuItem.addCredits}
            </div>
            {activeItem === SettingsMenuItem.addCredits && (
              <div className="settings-menu-item-underline" />
            )}
          </div>

          <div
            className={classNames("settings-menu-item", "clickable")}
            onClick={() => {
              this.onClickMenu(SettingsMenuItem.redeemCredit);
            }}
          >
            <div
              className={classNames("settings-menu-item-name", {
                active: activeItem === SettingsMenuItem.redeemCredit,
              })}
            >
              Ad Manager
            </div>
            {activeItem === SettingsMenuItem.redeemCredit && (
              <div className="settings-menu-item-underline" />
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ user }) {
  return {
    user: user,
  };
}

export default connect(mapStateToProps)(SettingsMenu);
