import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";

import images from "../../constants/images";
import withSizes from "react-sizes";

// get our fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

import { setGridsetAsMaster } from "../../actions";

import Modal from "react-modal";

import "./styles.scss";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

class TopHeaderBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false,
      buttonDisabled: true,
      pwd: "",
      errMsg: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  onPassword = (e) => {
    const { pwd } = this.state;
    var buttonDisabled = pwd ? false : true;
    this.setState({
      pwd: e.target.value,
      buttonDisabled,
    });
  };

  setPlaylistGroupAsMaster = () => {
    const { gridsets, user } = this.props;
    const { setGridsetAsMaster } = this.props;
    const { pwd } = this.state;

    clearTimeout(this.timer);

    if (pwd.toString() !== "1234") {
      this.setState({
        errMsg: true,
      });
      this.timer = setTimeout(() => {
        this.setState({ errMsg: false });
      }, 3000);
    } else {
      setGridsetAsMaster(gridsets[user].id)
        .then((res) => {
          if (res.success) {
            alert(
              `The gridset ${gridsets[user].id}#${gridsets[user].name} has set as Master!`
            );
            this.setState({
              modalIsOpen: false,
            });
          } else {
            alert(
              `The gridset ${gridsets[user].id}#${gridsets[user].name} is empty!`
            );
            this.setState({
              modalIsOpen: false,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  render() {
    const { active, scene } = this.props;
    if (active === "M1") {
      return (
        <div className="topHeaderBar">
          <div className="logo">
            <Link to="/">
              <img
                src={images.btnProgHeadLogoTyr}
                className="headerLogo"
                alt="Tethyr Logo"
                title="Tethyr Logo"
              />
            </Link>
            <Link to="/">
              <img
                src={images.btnProgHeadLogoTyrIcon}
                className="mobileLogo"
                alt="Tethyr Logo"
                title="Tethyr Logo"
              />
            </Link>
            <div className="dropdownbuttons">
              <a
                href="https://andmoor.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={images.btnProgHeadLogoAnd}
                  className="headerLogo"
                  alt="Andmoor Logo"
                  title="Andmoor Logo"
                />
                <img
                  src={images.btnProgHeadLogoAndIcon}
                  className="mobileLogo"
                  alt="Andmoor Logo"
                  title="Andmoor Logo"
                />
              </a>
            </div>
          </div>

          <div className="m1-menu">
            <div className="login">
              <div className=" dropdown">
                <img
                  src={images.btnProgHeadUser}
                  alt="User"
                  title="User"
                  height="35px"
                />
                <div className="dropdownbuttons">
                  <span className="userSpan">
                    {" "}
                    user {sessionStorage.getItem("userId")} :{" "}
                    {sessionStorage.getItem("username")}
                  </span>
                  <button onClick={this.props.logout}>LOGOUT</button>
                </div>
              </div>
            </div>
            <div className="interface">
              <div className="dropdown">
                <img
                  src={images.btnProgHeadModeViewer}
                  alt="Mode"
                  title="Mode"
                  height="35px"
                />
                <div className="dropdownbuttons">
                  <Link to="/tour">
                    <img
                      src={images.btnProgHeadModeTour}
                      alt="Tour"
                      title="Viewer"
                      width="35px"
                      height="35px"
                    />
                  </Link>
                  <Link to="/viewer">
                    <img
                      src={images.btnProgHeadModeViewer}
                      alt="Viewer"
                      title="Viewer"
                      width="35px"
                      height="35px"
                    />
                  </Link>
                  <Link to="/manage">
                    <img
                      src={images.btnProgHeadModeManager}
                      alt="Group Manager"
                      title="Group Manager"
                      width="35px"
                      height="35px"
                    />
                  </Link>
                  <Link to="/settings">
                    <img
                      src={images.btnProgHeadModeSettings}
                      alt="Personal Settings"
                      title="Personal Settings"
                      width="35px"
                      height="35px"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="smalllayout">
              <div className="dropdown">
                <button
                  className="selected"
                  style={{
                    width: "35px",
                    height: "35px",
                    border: "1px solid #525050",
                  }}
                >
                  {active}
                </button>
                <div className="dropdownbuttons">
                  <div style={{ display: "flex" }}>
                    <img
                      src={
                        active === "M1"
                          ? images.btnProgHeadM1_active
                          : images.btnProgHeadM1
                      }
                      onClick={() => this.props.onLayoutSelect("M1")}
                      className="layoutBtn"
                      alt="Layout M1"
                      title="Layout M1"
                    />
                    <img
                      src={
                        active === "M4"
                          ? images.btnProgHeadM4_active
                          : images.btnProgHeadM4
                      }
                      onClick={() => this.props.onLayoutSelect("M4")}
                      className="layoutBtn"
                      alt="Layout M4"
                      title="Layout M4"
                    />
                    <img
                      src={
                        active === "G1"
                          ? images.btnProgHeadG1_active
                          : images.btnProgHeadG1
                      }
                      onClick={() => this.props.onLayoutSelect("G1")}
                      className="layoutBtn"
                      alt="Layout G1"
                      title="Layout G1"
                    />
                    <img
                      src={
                        active === "G2"
                          ? images.btnProgHeadG2_active
                          : images.btnProgHeadG2
                      }
                      onClick={() => this.props.onLayoutSelect("G2")}
                      className="layoutBtn"
                      alt="Layout G2"
                      title="Layout G2"
                    />
                    <img
                      src={
                        active === "G2c1"
                          ? images.btnProgHeadG2c1_active
                          : images.btnProgHeadG2c1
                      }
                      onClick={() => this.props.onLayoutSelect("G2c1")}
                      className="layoutBtn"
                      alt="Layout G2c1"
                      title="Layout G2c1"
                    />
                    <img
                      src={
                        active === "G3c1"
                          ? images.btnProgHeadG3c1_active
                          : images.btnProgHeadG3c1
                      }
                      onClick={() => this.props.onLayoutSelect("G3c1")}
                      className="layoutBtn"
                      alt="Layout G3c1"
                      title="Layout G3c1"
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <img
                      src={
                        active === "G4"
                          ? images.btnProgHeadG4_active
                          : images.btnProgHeadG4
                      }
                      onClick={() => this.props.onLayoutSelect("G4")}
                      className="layoutBtn"
                      alt="Layout G4"
                      title="Layout G4"
                    />
                    <img
                      src={
                        active === "G4pro"
                          ? images.btnProgHeadG4pro_active
                          : images.btnProgHeadG4pro
                      }
                      onClick={() => this.props.onLayoutSelect("G4pro")}
                      className="layoutBtn"
                      alt="Layout G4pro"
                      title="Layout G4pro"
                    />
                    <img
                      src={
                        active === "G4c1"
                          ? images.btnProgHeadG4c1_active
                          : images.btnProgHeadG4c1
                      }
                      onClick={() => this.props.onLayoutSelect("G4c1")}
                      className="layoutBtn"
                      alt="Layout G4c1"
                      title="Layout G4c1"
                    />
                    <img
                      src={
                        active === "G6"
                          ? images.btnProgHeadG6_active
                          : images.btnProgHeadG6
                      }
                      onClick={() => this.props.onLayoutSelect("G6")}
                      className="layoutBtn"
                      alt="Layout G6"
                      title="Layout G6"
                    />
                    <img
                      src={
                        active === "G8"
                          ? images.btnProgHeadG8_active
                          : images.btnProgHeadG8
                      }
                      onClick={() => this.props.onLayoutSelect("G8")}
                      className="layoutBtn"
                      alt="Layout G8"
                      title="Layout G8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}
          >
            <div className="control">
              <button
                className={
                  this.props.playAll === true ? "playall selected" : "playall"
                }
                onClick={() => this.props.pauseVideos(false)}
              >
                Play All
              </button>
              <button
                className={
                  this.props.pauseAll === true
                    ? "pauseall selected"
                    : "pauseall"
                }
                onClick={() => this.props.pauseVideos(true)}
              >
                Pause All
              </button>
            </div>
            <div className="control mobile-menu">
              <button
                className={
                  this.props.playAll === true ? "playall selected" : "playall"
                }
                onClick={() => this.props.pauseVideos(false)}
              >
                <FontAwesomeIcon icon={faPlay} />
              </button>
              <button
                className={
                  this.props.pauseAll === true
                    ? "pauseall selected"
                    : "pauseall"
                }
                onClick={() => this.props.pauseVideos(true)}
              >
                <FontAwesomeIcon icon={faPause} />
              </button>
            </div>
          </div>
        </div>
      );
    } else if (active === "M1Side") {
      return (
        <div className="topHeaderBar">
          <div className="logo">
            <Link to="/">
              <img
                src={images.btnProgHeadLogoTyr}
                className="headerLogo"
                alt="Tethyr Logo"
                title="Tethyr Logo"
              />
            </Link>
            <Link to="/">
              <img
                src={images.btnProgHeadLogoTyrIcon}
                className="mobileLogo"
                alt="Tethyr Logo"
                title="Tethyr Logo"
              />
            </Link>
            <div className="dropdownbuttons">
              <a
                href="https://andmoor.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={images.btnProgHeadLogoAnd}
                  className="headerLogo"
                  alt="Andmoor Logo"
                  title="Andmoor Logo"
                />
                <img
                  src={images.btnProgHeadLogoAndIcon}
                  className="mobileLogo"
                  alt="Andmoor Logo"
                  title="Andmoor Logo"
                />
              </a>
            </div>
          </div>

          <div className="m1-menu">
            <div className="login">
              <div className=" dropdown">
                <img
                  src={images.btnProgHeadUser}
                  alt="User"
                  title="User"
                  height="35px"
                />
                <div className="dropdownbuttons">
                  <span className="userSpan">
                    {" "}
                    user {sessionStorage.getItem("userId")} :{" "}
                    {sessionStorage.getItem("username")}
                  </span>
                  <button onClick={this.props.logout}>LOGOUT</button>
                </div>
              </div>
            </div>
            <div className="interface">
              <div className="dropdown">
                <img
                  src={images.btnProgHeadModeViewer}
                  alt="Mode"
                  title="Mode"
                  height="35px"
                />
                <div className="dropdownbuttons">
                  <Link to="/tour">
                    <img
                      src={images.btnProgHeadModeTour}
                      alt="Viewer"
                      title="Viewer"
                      width="35px"
                      height="35px"
                    />
                  </Link>
                  <Link to="/viewer">
                    <img
                      src={images.btnProgHeadModeViewer}
                      alt="Viewer"
                      title="Viewer"
                      width="35px"
                      height="35px"
                    />
                  </Link>
                  <Link to="/manage">
                    <img
                      src={images.btnProgHeadModeManager}
                      alt="Group Manger"
                      title="Group Manager"
                      width="35px"
                      height="35px"
                    />
                  </Link>
                  <Link to="/settings">
                    <img
                      src={images.btnProgHeadModeSettings}
                      alt="Personal Settings"
                      title="Personal Settings"
                      width="35px"
                      height="35px"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="smalllayout">
              <div className="dropdown">
                <button
                  className="selected"
                  style={{
                    width: "35px",
                    height: "35px",
                    border: "1px solid #525050",
                  }}
                >
                  {"M1"}
                </button>
                <div className="dropdownbuttons">
                  <div style={{ display: "flex" }}>
                    <img
                      src={images.btnProgHeadM1_active}
                      onClick={() => this.props.onLayoutSelect("M1")}
                      className="layoutBtn"
                      alt="Layout M1"
                      title="Layout M1"
                    />
                    <img
                      src={
                        active === "M4"
                          ? images.btnProgHeadM4_active
                          : images.btnProgHeadM4
                      }
                      onClick={() => this.props.onLayoutSelect("M4")}
                      className="layoutBtn"
                      alt="Layout M4"
                      title="Layout M4"
                    />
                    <img
                      src={
                        active === "G1"
                          ? images.btnProgHeadG1_active
                          : images.btnProgHeadG1
                      }
                      onClick={() => this.props.onLayoutSelect("G1")}
                      className="layoutBtn"
                      alt="Layout G1"
                      title="Layout G1"
                    />
                    <img
                      src={
                        active === "G2"
                          ? images.btnProgHeadG2_active
                          : images.btnProgHeadG2
                      }
                      onClick={() => this.props.onLayoutSelect("G2")}
                      className="layoutBtn"
                      alt="Layout G2"
                      title="Layout G2"
                    />
                    <img
                      src={
                        active === "G2c1"
                          ? images.btnProgHeadG2c1_active
                          : images.btnProgHeadG2c1
                      }
                      onClick={() => this.props.onLayoutSelect("G2c1")}
                      className="layoutBtn"
                      alt="Layout G2c1"
                      title="Layout G2c1"
                    />
                    <img
                      src={
                        active === "G3c1"
                          ? images.btnProgHeadG3c1_active
                          : images.btnProgHeadG3c1
                      }
                      onClick={() => this.props.onLayoutSelect("G3c1")}
                      className="layoutBtn"
                      alt="Layout G3c1"
                      title="Layout G3c1"
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <img
                      src={
                        active === "G4"
                          ? images.btnProgHeadG4_active
                          : images.btnProgHeadG4
                      }
                      onClick={() => this.props.onLayoutSelect("G4")}
                      className="layoutBtn"
                      alt="Layout G4"
                      title="Layout G4"
                    />
                    <img
                      src={
                        active === "G4pro"
                          ? images.btnProgHeadG4pro_active
                          : images.btnProgHeadG4pro
                      }
                      onClick={() => this.props.onLayoutSelect("G4pro")}
                      className="layoutBtn"
                      alt="Layout G4pro"
                      title="Layout G4pro"
                    />
                    <img
                      src={
                        active === "G4c1"
                          ? images.btnProgHeadG4c1_active
                          : images.btnProgHeadG4c1
                      }
                      onClick={() => this.props.onLayoutSelect("G4c1")}
                      className="layoutBtn"
                      alt="Layout G4c1"
                      title="Layout G4c1"
                    />
                    <img
                      src={
                        active === "G6"
                          ? images.btnProgHeadG6_active
                          : images.btnProgHeadG6
                      }
                      onClick={() => this.props.onLayoutSelect("G6")}
                      className="layoutBtn"
                      alt="Layout G6"
                      title="Layout G6"
                    />
                    <img
                      src={
                        active === "G8"
                          ? images.btnProgHeadG8_active
                          : images.btnProgHeadG8
                      }
                      onClick={() => this.props.onLayoutSelect("G8")}
                      className="layoutBtn"
                      alt="Layout G8"
                      title="Layout G8"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="layouts">
              <div className="dropdown">
                <img
                  src={images.btnProgHeadGridset}
                  alt="Gridset"
                  title="Select Playlist Group"
                  height="35px"
                />
                <div className="dropdownbuttons">
                  <select
                    value={this.props.user}
                    onChange={this.props.onUserSelect}
                    alt="select gridset"
                  >
                    {this.props.filteredUsers.map((user, idx) => (
                      <option key={idx} value={idx}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {this.props.showPlaylist !== -1 && (
              <div className="topSelectPlaylist">
                <div className="dropdown">
                  <img
                    src={images.btnPlaylistHeadPlaylist}
                    alt="Gridset"
                    title="Select Playlist Group"
                    height="35px"
                  />
                  <div className="dropdownbuttons">
                    <select
                      value={this.props.playlist[this.props.showPlaylist].id}
                      onChange={this.props.onPlaylistSelect}
                    >
                      {this.props.playlists.map((list, idx) => {
                        return (
                          <option key={idx} value={list.id}>
                            {list.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            style={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}
          >
            <div className="control">
              <button
                className={
                  this.props.playAll === true ? "playall selected" : "playall"
                }
                onClick={() => this.props.pauseVideos(false)}
              >
                Play All
              </button>
              <button
                className={
                  this.props.pauseAll === true
                    ? "pauseall selected"
                    : "pauseall"
                }
                onClick={() => this.props.pauseVideos(true)}
              >
                Pause All
              </button>
            </div>
            <div className="control mobile-menu">
              <button
                className={
                  this.props.playAll === true ? "playall selected" : "playall"
                }
                onClick={() => this.props.pauseVideos(false)}
              >
                <FontAwesomeIcon icon={faPlay} />
              </button>
              <button
                className={
                  this.props.pauseAll === true
                    ? "pauseall selected"
                    : "pauseall"
                }
                onClick={() => this.props.pauseVideos(true)}
              >
                <FontAwesomeIcon icon={faPause} />
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="topHeaderBar">
          <div className="logo">
            <div className="dropdown">
              <Link to="/">
                <img
                  src={images.btnProgHeadLogoTyr}
                  className="headerLogo"
                  alt="Tethyr Logo"
                  title="Tethyr Logo"
                />
              </Link>
              <Link to="/">
                <img
                  src={images.btnProgHeadLogoTyrIcon}
                  className="mobileLogo"
                  alt="Tethyr Logo"
                  title="Tethyr Logo"
                />
              </Link>
              <div className="dropdownbuttons">
                <a
                  href="https://andmoor.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={images.btnProgHeadLogoAnd}
                    className="headerLogo"
                    alt="Andmoor Logo"
                    title="Andmoor Logo"
                  />
                  <img
                    src={images.btnProgHeadLogoAndIcon}
                    className="mobileLogo"
                    alt="Andmoor Logo"
                    title="Andmoor Logo"
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="left-menu">
            <div className="login">
              <div className=" dropdown">
                <img
                  src={images.btnProgHeadUser}
                  alt="User"
                  title="User"
                  height="35px"
                />
                <div className="dropdownbuttons">
                  <span className="userSpan">
                    {" "}
                    user {sessionStorage.getItem("userId")} :{" "}
                    {sessionStorage.getItem("username")}
                  </span>
                  <button onClick={this.props.logout}>LOGOUT</button>
                </div>
              </div>
            </div>
            <div className="interface">
              <label>Interface:</label>
              <div className="dropdown">
                {scene === "viewer" && (
                  <button className="selected">Tethyr Viewer</button>
                )}
                {scene === "manage" && (
                  <button className="selected">Groups Manager</button>
                )}
                {scene === "setting" && (
                  <button className="selected">Settings</button>
                )}
                <div className="dropdownbuttons">
                  <Link to="/tour">
                    <button className={scene === "setting" ? "selected" : ""}>
                      Tour
                    </button>
                  </Link>
                  <Link to="/viewer">
                    <button className={scene === "viewer" ? "selected" : ""}>
                      Tethyr Viewer
                    </button>
                  </Link>
                  <Link to="/manage">
                    <button className={scene === "manage" ? "selected" : ""}>
                      Groups Manager
                    </button>
                  </Link>
                  <Link to="/settings">
                    <button className={scene === "setting" ? "selected" : ""}>
                      Account Settings
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {scene === "viewer" && (
            <div className="layout-menu">
              <div className="layouts">
                <label>Layout:</label>
                <div className="dropdown">
                  <button className="selected">{active}</button>
                  <div className="dropdownbuttons">
                    <img
                      src={active === "M1" ? images.btnM1_active : images.btnM1}
                      onClick={() => this.props.onLayoutSelect("M1")}
                      className="layoutBtn"
                      alt="Layout M1"
                      title="Layout M1"
                    />
                    <img
                      src={active === "M4" ? images.btnM4_active : images.btnM4}
                      onClick={() => this.props.onLayoutSelect("M4")}
                      className="layoutBtn"
                      alt="Layout M4"
                      title="Layout M4"
                    />
                    <img
                      src={active === "G1" ? images.btnG1_active : images.btnG1}
                      onClick={() => this.props.onLayoutSelect("G1")}
                      className="layoutBtn"
                      alt="Layout G1"
                      title="Layout G1"
                    />
                    <img
                      src={active === "G2" ? images.btnG2_active : images.btnG2}
                      onClick={() => this.props.onLayoutSelect("G2")}
                      className="layoutBtn"
                      alt="Layout G2"
                      title="Layout G2"
                    />
                    <img
                      src={
                        active === "G2c1"
                          ? images.btnG2c1_active
                          : images.btnG2c1
                      }
                      onClick={() => this.props.onLayoutSelect("G2c1")}
                      className="layoutBtn"
                      alt="Layout G2c1"
                      title="Layout G2c1"
                    />
                    <img
                      src={
                        active === "G3c1"
                          ? images.btnG3c1_active
                          : images.btnG3c1
                      }
                      onClick={() => this.props.onLayoutSelect("G3c1")}
                      className="layoutBtn"
                      alt="Layout G3c1"
                      title="Layout G3c1"
                    />
                    <img
                      src={active === "G4" ? images.btnG4_active : images.btnG4}
                      onClick={() => this.props.onLayoutSelect("G4")}
                      className="layoutBtn"
                      alt="Layout G4"
                      title="Layout G4"
                    />
                    <img
                      src={
                        active === "G4pro"
                          ? images.btnG4pro_active
                          : images.btnG4pro
                      }
                      onClick={() => this.props.onLayoutSelect("G4pro")}
                      className="layoutBtn"
                      alt="Layout PRO"
                      title="Layout PRO"
                    />
                    <img
                      src={
                        active === "G4c1"
                          ? images.btnG4c1_active
                          : images.btnG4c1
                      }
                      onClick={() => this.props.onLayoutSelect("G4c1")}
                      className="layoutBtn"
                      alt="Layout G4c1"
                      title="Layout G4c1"
                    />
                    <img
                      src={active === "G6" ? images.btnG6_active : images.btnG6}
                      onClick={() => this.props.onLayoutSelect("G6")}
                      className="layoutBtn"
                      alt="Layout G6"
                      title="Layout G6"
                    />
                    <img
                      src={active === "G8" ? images.btnG8_active : images.btnG8}
                      onClick={() => this.props.onLayoutSelect("G8")}
                      className="layoutBtn"
                      alt="Layout G8"
                      title="Layout G8"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mobile-menu">
            <div className="login">
              <div className=" dropdown">
                <img
                  src={images.btnProgHeadUser}
                  alt="User"
                  title="User"
                  height="35px"
                />
                <div className="dropdownbuttons">
                  <span className="userSpan">
                    {" "}
                    user {sessionStorage.getItem("userId")} :{" "}
                    {sessionStorage.getItem("username")}
                  </span>
                  <button onClick={this.props.logout}>LOGOUT</button>
                </div>
              </div>
            </div>
            <div className="interface">
              <div className="dropdown">
                <img
                  src={images.btnProgHeadModeViewer}
                  alt="Mode"
                  title="Mode"
                  height="35px"
                />
                <div className="dropdownbuttons">
                  <Link to="/viewer">
                    <img
                      src={images.btnProgHeadModeViewer}
                      alt="Viewer"
                      title="Viewer"
                      width="35px"
                      height="35px"
                    />
                  </Link>
                  <Link to="/manage">
                    <img
                      src={images.btnProgHeadModeManager}
                      alt="Group Manager"
                      title="Group Manager"
                      width="35px"
                      height="35px"
                    />
                  </Link>
                  <Link to="/settings">
                    <img
                      src={images.btnProgHeadModeSettings}
                      alt="Personal Settings"
                      title="Personal Settings"
                      width="35px"
                      height="35px"
                    />
                  </Link>
                </div>
              </div>
            </div>
            {scene === "viewer" && (
              <React.Fragment>
                <div className="smalllayout">
                  <div className="dropdown">
                    <button
                      className="selected"
                      style={{
                        width: "35px",
                        height: "35px",
                        border: "1px solid #525050",
                      }}
                    >
                      {active}
                    </button>
                    <div className="dropdownbuttons">
                      <div style={{ display: "flex" }}>
                        <img
                          src={
                            active === "M1"
                              ? images.btnProgHeadM1_active
                              : images.btnProgHeadM1
                          }
                          onClick={() => this.props.onLayoutSelect("M1")}
                          className="layoutBtn"
                          alt="Layout M1"
                          title="Layout M1"
                        />
                        <img
                          src={
                            active === "M4"
                              ? images.btnProgHeadM4_active
                              : images.btnProgHeadM4
                          }
                          onClick={() => this.props.onLayoutSelect("M4")}
                          className="layoutBtn"
                          alt="Layout M4"
                          title="Layout M4"
                        />
                        <img
                          src={
                            active === "G1"
                              ? images.btnProgHeadG1_active
                              : images.btnProgHeadG1
                          }
                          onClick={() => this.props.onLayoutSelect("G1")}
                          className="layoutBtn"
                          alt="Layout G1"
                          title="Layout G1"
                        />
                        <img
                          src={
                            active === "G2"
                              ? images.btnProgHeadG2_active
                              : images.btnProgHeadG2
                          }
                          onClick={() => this.props.onLayoutSelect("G2")}
                          className="layoutBtn"
                          alt="Layout G2"
                          title="Layout G2"
                        />
                        <img
                          src={
                            active === "G2c1"
                              ? images.btnProgHeadG2c1_active
                              : images.btnProgHeadG2c1
                          }
                          onClick={() => this.props.onLayoutSelect("G2c1")}
                          className="layoutBtn"
                          alt="Layout G2c1"
                          title="Layout G2c1"
                        />
                        <img
                          src={
                            active === "G3c1"
                              ? images.btnProgHeadG3c1_active
                              : images.btnProgHeadG3c1
                          }
                          onClick={() => this.props.onLayoutSelect("G3c1")}
                          className="layoutBtn"
                          alt="Layout G3c1"
                          title="Layout G3c1"
                        />
                      </div>
                      <div style={{ display: "flex" }}>
                        <img
                          src={
                            active === "G4"
                              ? images.btnProgHeadG4_active
                              : images.btnProgHeadG4
                          }
                          onClick={() => this.props.onLayoutSelect("G4")}
                          className="layoutBtn"
                          alt="Layout G4"
                          title="Layout G4"
                        />
                        <img
                          src={
                            active === "G4pro"
                              ? images.btnProgHeadG4pro_active
                              : images.btnProgHeadG4pro
                          }
                          onClick={() => this.props.onLayoutSelect("G4pro")}
                          className="layoutBtn"
                          alt="Layout G4pro"
                          title="Layout G4pro"
                        />
                        <img
                          src={
                            active === "G4c1"
                              ? images.btnProgHeadG4c1_active
                              : images.btnProgHeadG4c1
                          }
                          onClick={() => this.props.onLayoutSelect("G4c1")}
                          className="layoutBtn"
                          alt="Layout G4c1"
                          title="Layout G4c1"
                        />
                        <img
                          src={
                            active === "G6"
                              ? images.btnProgHeadG6_active
                              : images.btnProgHeadG6
                          }
                          onClick={() => this.props.onLayoutSelect("G6")}
                          className="layoutBtn"
                          alt="Layout G6"
                          title="Layout G6"
                        />
                        <img
                          src={
                            active === "G8"
                              ? images.btnProgHeadG8_active
                              : images.btnProgHeadG8
                          }
                          onClick={() => this.props.onLayoutSelect("G8")}
                          className="layoutBtn"
                          alt="Layout G8"
                          title="Layout G8"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="layouts">
                  <div className="dropdown">
                    <img
                      src={images.btnProgHeadGridset}
                      alt="Gridset"
                      title="Select Playlist Group"
                      height="35px"
                    />
                    <div className="dropdownbuttons">
                      <select
                        value={this.props.user}
                        onChange={this.props.onUserSelect}
                        alt="select gridset"
                        style={{ height: "30px", lineHeight: "30px" }}
                      >
                        {this.props.filteredUsers.map((user, idx) => (
                          <option key={idx} value={idx}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
          {scene === "viewer" && (
            <div
              style={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "flex-end",
              }}
            >
              <div className="selectGridset">
                <label>Playlist Group:</label>
                <select
                  value={this.props.user}
                  onChange={this.props.onUserSelect}
                  alt="select gridset"
                >
                  {this.props.filteredUsers.map((user, idx) => (
                    <option key={idx} value={idx}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="interface">
                <div className="dropdown">
                  <img
                    src={images.btn_playlist_group_action}
                    className="playlist_group_btn"
                    alt="playlist group button"
                  />
                  <div className="dropdownbuttons playlist_group">
                    <button onClick={this.openModal}>
                      Set Playlist Group as Master
                    </button>
                  </div>
                  <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Set Playlist Group As Master"
                  >
                    <h5>Password</h5>
                    <input
                      type="password"
                      maxLength="4"
                      onChange={this.onPassword}
                    />
                    <br />
                    <br />
                    {this.state.errMsg && (
                      <React.Fragment>
                        <p style={{ color: "red" }}>Invalid Password</p>
                        <br />
                      </React.Fragment>
                    )}
                    <button
                      onClick={this.setPlaylistGroupAsMaster}
                      disabled={this.state.buttonDisabled}
                    >
                      Set As Master
                    </button>
                  </Modal>
                </div>
              </div>
              {/* <div className="interface">
                <div className="dropdown">
                  {!timer_on && (
                    <img
                      src={images.btn_timer_off}
                      className="playlist_group_btn"
                    />
                  )}
                  {timer_on && (
                    <img
                      src={images.btn_timer_on}
                      className="playlist_group_btn"
                    />
                  )}

                  <div className="dropdownbuttons playlist_group">
                    <button
                      className="timer"
                      onClick={() => {
                        this.props.timer_change();
                      }}
                    >
                      OFF
                    </button>
                    <button
                      className="timer"
                      onClick={() => {
                        this.props.timer_state_change(1);
                      }}
                    >
                      1 MIN
                    </button>
                    <button
                      className="timer"
                      onClick={() => {
                        this.props.timer_state_change(2);
                      }}
                    >
                      2 MIN
                    </button>
                    <button
                      className="timer"
                      onClick={() => {
                        this.props.timer_state_change(3);
                      }}
                    >
                      3 MIN
                    </button>
                  </div>
                </div>
              </div> */}

              <div className="control">
                <button
                  className={
                    this.props.playAll === true ? "playall selected" : "playall"
                  }
                  onClick={() => this.props.pauseVideos(false)}
                >
                  Play All
                </button>
                <button
                  className={
                    this.props.pauseAll === true
                      ? "pauseall selected"
                      : "pauseall"
                  }
                  onClick={() => this.props.pauseVideos(true)}
                >
                  Pause All
                </button>
              </div>
              <div className="control mobile-menu">
                <button
                  className={
                    this.props.playAll === true ? "playall selected" : "playall"
                  }
                  onClick={() => this.props.pauseVideos(false)}
                >
                  <FontAwesomeIcon icon={faPlay} />
                </button>
                <button
                  className={
                    this.props.pauseAll === true
                      ? "pauseall selected"
                      : "pauseall"
                  }
                  onClick={() => this.props.pauseVideos(true)}
                >
                  <FontAwesomeIcon icon={faPause} />
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
  }
}

const mapSizesToProps = ({ width }) => ({
  mobileLayout: width < 100,
});

const mapDispatchToProps = (dispatch) => ({
  setGridsetAsMaster: bindActionCreators(setGridsetAsMaster, dispatch),
});

export default withSizes(mapSizesToProps)(
  connect(null, mapDispatchToProps)(TopHeaderBar)
);
