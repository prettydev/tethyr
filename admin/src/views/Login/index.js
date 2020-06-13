import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from '../../components/Loading';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons
import Lock from "@material-ui/icons/Lock";
import Email from "@material-ui/icons/Email";

// core components
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import CustomInput from "../../components/CustomInput/CustomInput";
import Button from "../../components/CustomButtons/Button";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import CardFooter from "../../components/Card/CardFooter";
import Danger from "../../components/Typography/Danger.jsx";

import loginPageStyle from "../../assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

import { loginAction } from '../../actions/auth';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      loading: false,
      showError: false,
      errMsg: '',
    };
  }

  onLogin = () => {
    const { email, password } = this.state;
    const { login } = this.props;
    this.setState({ loading: true });
    login(email, password)
      .then(() => {
        const { history } = this.props;
        history.push('/main');
      })
      .catch((msg) => {
        this.setState({ loading: false, showError: true, errMsg: msg });
      })
  }

  onUpdateValue = (field, value) => {
    const update = {};
    update[field] = value;
    update.showError = false;
    this.setState(update);
  }

  render() {
    const { email, password, loading, showError, errMsg } = this.state;
    const { classes } = this.props;

    const userId = sessionStorage.getItem('userId');
    const isLoggedIn = userId !== null && !isNaN(userId);

    if (isLoggedIn) {
      return <Redirect to={{ pathname: '/main', state: {from: '/login'} }} />
    }

    return (
      <div className={classes.outerContainer}>
        {loading ? <Loading /> : null}
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={6} md={4}>
              <form>
                <Card login className={classes[this.state.cardAnimaton]}>
                  <CardHeader
                    className={`${classes.cardHeader} ${classes.textCenter}`}
                    color="rose"
                  >
                    <h4 className={classes.cardTitle}>Log in</h4>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      labelText="Email..."
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: email,
                        onChange: (e) => this.onUpdateValue('email', e.target.value),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        )
                      }}
                    />
                    <CustomInput
                      labelText="Password"
                      id="password"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        value: password,
                        onChange: (e) => this.onUpdateValue('password', e.target.value),
                        inputProps: {
                          type: 'password'
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <Lock className={classes.inputAdornmentIcon} />
                          </InputAdornment>
                        )
                      }}
                    />
                    {showError ?
                      <Danger>
                        {errMsg}
                      </Danger>
                      : null}
                  </CardBody>
                  <CardFooter className={classes.justifyContentCenter}>
                    <Button color="rose" simple size="lg" block onClick={this.onLogin}>
                      Let's Go
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  login: bindActionCreators(loginAction, dispatch),
})

export default withStyles(loginPageStyle)(connect(null, mapDispatchToProps)(Login));
