import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import "./styles.css";
import gif from "../../../src/assets/images/LoggedIn/logged_in_ANI.gif";
import { Container, Row, Col, ResponsiveEmbed } from "react-bootstrap";

class LoggedIn extends Component {
  componentDidMount() {
    const { user } = this.props;
    console.log(user.loggedIn);
    if (!user.loggedIn) {
      console.log(user.user.status);
      this.props.history.push("/");
    }
  }

  render() {
    const { user } = this.props;
    return (
      <div className="landing-tour">
        <Container>
          <h1 className="loggedIn">
            Hello {user.user.firstName} You are logged In. Welcome to Tethyr
          </h1>
        </Container>
        <Container>
          <Row></Row>
          <Row>
            <Col md={6} sm={12}>
              <p className="loggedIn">
                Ready to see how Tethyr puts all your media happenings in one
                spot? Let’s go! <br></br>
                We get you started with three Playlist Groups (pGroups, named by
                multi-tasking geeks). Then you add more pGroups based on your
                unquestioned tastes.<br></br>
                Go ahead, create playlists involving Crossfit videos, insomnia
                podcasts, and Pandora tunes. No one here will judge you. Plus
                you’ll save time by not switching apps constantly.<br></br>
                Our interface is powerful, but don’t you be afraid to use it and
                fiddle around. If you break something we have nerds around ready
                to repair stuff. Our mission - to put all your media in one spot
                so you’re not switching apps (screens) 2.37 hours a day anymore.
                <br></br>
                Ready your clicker… the action is coming as you head to the
                “Viewer.”<br></br>
              </p>
              <Link to="/viewer">
                <button className="viewer-button">Go to the Viewer</button>
                <br></br>
              </Link>
              <p className="loggedIn">
                Tethyr is in Beta mode. That means it’s ok to reach out for
                help. We want our people’s input. Firstly we want you as one of
                our people! Email us at tethyrapp@gmail.com, hit us up on social
                media or use the chat box.{" "}
              </p>
              <br></br>
              <div className="loggedIn-video">
                <ResponsiveEmbed aspectRatio="16by9">
                  <embed src="https://www.youtube.com/embed/2I5OdBLbyyM" />
                </ResponsiveEmbed>
              </div>
            </Col>
            <Col md={6} sm={12}>
              <div className="loggedIn-gif">
                <ResponsiveEmbed>
                  <embed src={`${gif}`} />
                </ResponsiveEmbed>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return {
    user,
  };
};

export default withRouter(connect(mapStateToProps)(LoggedIn));
