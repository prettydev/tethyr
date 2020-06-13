/**
 * Copyright (c) 2020
 *
 * @summary Membership Tab
 * @author Pretty Dev <creditcoder@gmail.com>
 *
 * Created at     : 2020-04-17 11:20:56
 * Last modified  : 2020-06-02 05:31:40
 */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Alert from "@material-ui/lab/Alert";
//import StarIcon from "@material-ui/icons/StarBorder";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import axios from "axios";

import config from "../../../config/config";
//import { updateRole } from "../../../redux/actions/user";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

const urlEncode = function (data) {
  var str = [];
  for (var p in data) {
    if (
      data.hasOwnProperty(p) &&
      !(data[p] === undefined || data[p] === null)
    ) {
      str.push(
        encodeURIComponent(p) +
          "=" +
          (data[p] ? encodeURIComponent(data[p]) : "")
      );
    }
  }
  return str.join("&");
};

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(0, 0, 0),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(4),
  },
}));

function AddCredits(props) {
  const [state, setState] = useState({
    first_name: "",
    last_name: "",
    company: "", //    optional
    email: "",
    phone: "", //    optional
  });

  const [loading, setLoading] = useState("");
  const [errorMsg] = useState("");
  const [cbInstance, setCbInstance] = useState(null);
  const [addons, setAddons] = useState([]);

  const handleCheckout = (addon_id, quantity = 1) => {
    setLoading(true);
    cbInstance.openCheckout({
      hostedPage: () => {
        let data = {
          first_name: state.first_name,
          last_name: state.last_name,
          email: state.email,
          phone: state.phone,
          company: state.company,
          id: props.user.user.subscription_id,
          role_id: props.user.user.role,
          addon_id,
          quantity,
        };
        return axios
          .post(
            `${config.apiBaseUrl}/chargebee/addons-checkout`,
            urlEncode(data)
          )
          .then((response) => response.data);
      },
      success(hostedPageId) {
        console.log("hostedPageId", hostedPageId);

        // props.dispatch(updateAddons(props.user.user.token, state.email, id, quantity));
      },
      close: () => {
        setLoading(false);
        console.log("checkout new closed");
      },
      step(step) {
        console.log("checkout", step);
      },
    });
  };

  const classes = useStyles();

  useEffect(() => {
    const el = document.createElement("script");
    el.onload = () => {
      const instance = window.Chargebee.init({
        site: config.chargebeeUrl,
      });
      setCbInstance(instance);
      // this.setState({ chargebeeReady: true });
    };
    el.setAttribute("src", "https://js.chargebee.com/v2/chargebee.js");
    document.body.appendChild(el);

    setLoading(true);
    axios.get(`${config.apiBaseUrl}/chargebee/addons`).then((res) => {
      setAddons(res.data);
      setLoading(false);
      window.Chargebee.registerAgain();
    });

    setState({
      first_name: props.user.user.firstName,
      last_name: props.user.user.lastName,
      company: "", //    optional
      email: props.user.user.email,
      phone: "", //    optional
    });
  }, []);

  useEffect(() => {}, [state, addons]);

  useEffect(() => {
    if (!cbInstance) return;
    cbInstance.setCheckoutCallbacks(function (cart) {
      // you can define a custom callbacks based on cart object

      let customer = {
        first_name: props.user.user.firstName,
        last_name: props.user.user.lastName,
        email: props.user.user.email,
        id: props.user.user.user_id,
      };

      cart.setCustomer(customer);
      return {
        loaded: function () {
          console.log("checkout opened", cart);
        },
        close: function () {
          console.log("checkout closed", cart);
        },
        success: function (hostedPageId) {
          console.log("hostedPageId", hostedPageId);

          //props.user.user.token, state.email, role_id, hostedPageId)
          let data = {
            hostedPageId,
            addon_id: cart.products[0].addons[0].id,
          };
          axios
            .post(
              `${config.apiBaseUrl}/chargebee/purchase-addon`,
              urlEncode(data)
            )
            .then((response) => response.data);
        },
        step: function (value) {
          console.log("current step is ", value);
        },
      };
    });

    cbInstance.setPortalCallbacks({
      close: function () {
        console.log("closed");
      },
      visit: function (value) {
        // value -> which page in checkout/portal
        console.log("visit...", value);
      },
    });
  }, [cbInstance]);

  return (
    <>
      {false && (
        <a href="javascript:void(0)" data-cb-type="portal">
          MANAGE ACCOUNT
        </a>
      )}
      <Container maxWidth="md" component="main">
        <Alert severity="info">This feature is in development.</Alert>
        {errorMsg && (
          <p className="text-danger">There were errors while submitting</p>
        )}
        <div className="form-group">
          {loading && (
            <span className="subscribe-process process">Loading&hellip;</span>
          )}
        </div>
        <Grid container spacing={5} alignItems="flex-end">
          {!loading &&
            addons.length > 0 &&
            addons.map((addon, tid) => (
              <Grid
                item
                key={addon.addon.name}
                xs={12}
                sm={addon.addon.name === "Enterprise" ? 12 : 6}
                md={4}
              >
                <Card>
                  <CardHeader
                    title={addon.addon.name}
                    subheader={addon.subheader}
                    titleTypographyProps={{ align: "center" }}
                    subheaderTypographyProps={{ align: "center" }}
                    className={classes.cardHeader}
                  />
                  <CardContent>
                    <div className={classes.cardPricing}>
                      <Typography
                        component="h3"
                        variant="h4"
                        color="textPrimary"
                      >
                        ${addon.addon.price / 100}
                      </Typography>
                    </div>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      // key={line}
                    >
                      {addon.addon.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {false && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            "<a href='javascript:void(0)' data-cb-type='checkout' data-cb-plan-id='cbdemo_free' data-cb-addons_id_0='" +
                            addon.addon.id +
                            "'>Purchase</a>",
                        }}
                      />
                    )}
                    <Button
                      onClick={() => handleCheckout(addon.addon.id)}
                      fullWidth
                      variant="contained"
                      color="primary"
                    >
                      Subscribe
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>
    </>
  );
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default withRouter(connect(mapStateToProps)(AddCredits));
