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
import StarIcon from "@material-ui/icons/StarBorder";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import axios from "axios";

import config from "../../../config/config";
import { updateRole } from "../../../redux/actions/user";

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
    marginBottom: theme.spacing(6),
  },
}));

function MembershipLevel(props) {
  const [loading, setLoading] = useState("");
  const [cbInstance, setCbInstance] = useState(null);
  const [tiers, setTiers] = useState([]);

  const classes = useStyles();

  const handleCheckout = (plan_id, role_id) => {
    setLoading(true);

    cbInstance.openCheckout({
      hostedPage: () => {
        let data = {
          first_name: props.user.user.firstName,
          last_name: props.user.user.lastName,
          email: props.user.user.email,
          subscription_id: props.user.user.subscription_id,
          plan_id,
          id: props.user.user.user_id,
        };
        return axios
          .post(`${config.apiBaseUrl}/chargebee/subscribe`, urlEncode(data))
          .then((response) => response.data);
      },
      success(hostedPageId) {
        console.log("hostedPageId", hostedPageId);
        props.dispatch(
          updateRole(
            props.user.user.token,
            props.user.user.email,
            role_id,
            hostedPageId
          )
        );
      },
      close: () => {
        setLoading(false);
        console.log("checkout new closed");
        setTimeout(() => {
          alert("Success subscribing " + plan_id);
        }, 1000);
      },
      step(step) {
        console.log("checkout", step);
      },
    });
  };

  useEffect(() => {
    const el = document.createElement("script");
    el.onload = () => {
      const instance = window.Chargebee.init({
        site: config.chargebeeUrl,
      });
      window.Chargebee.registerAgain();
      setCbInstance(instance);
    };
    el.setAttribute("src", "https://js.chargebee.com/v2/chargebee.js");
    document.body.appendChild(el);

    setLoading(true);
    axios.get(`${config.apiBaseUrl}/chargebee/plans`).then((res) => {
      setTiers(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {}, [tiers]);

  return (
    <>
      <Container maxWidth="md" component="main">
        <Alert severity="info">This feature is in development.</Alert>

        <div className="form-group">
          {loading && (
            <span className="subscribe-process process">Loading&hellip;</span>
          )}
        </div>

        <Grid container spacing={5} alignItems="flex-end">
          {!loading &&
            tiers.length > 0 &&
            tiers.map((tier, tid) =>
              tid === props.user.user.role ? (
                <Grid
                  item
                  key={tier.plan.name}
                  xs={12}
                  sm={tier.plan.name === "Enterprise" ? 12 : 6}
                  md={4}
                >
                  <Card>
                    <CardHeader
                      title={props.user.user.userName}
                      // subheader={tier.subheader}
                      titleTypographyProps={{ align: "center" }}
                      subheaderTypographyProps={{ align: "center" }}
                      action={tier.plan.id === "pro" ? <StarIcon /> : null}
                      className={classes.cardHeader}
                    />
                    <CardContent>
                      <Typography
                        component="h2"
                        variant="h3"
                        color="textPrimary"
                        align="center"
                      >
                        {tier.plan.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        align="center"
                        // key={line}
                      >
                        {tier.plan.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <div style={{ height: "35px" }}></div>
                    </CardActions>
                  </Card>
                </Grid>
              ) : (
                <Grid
                  item
                  key={tier.plan.name}
                  xs={12}
                  sm={tier.plan.name === "Enterprise" ? 12 : 6}
                  md={4}
                >
                  <Card>
                    <CardHeader
                      title={tier.plan.name}
                      subheader={tier.subheader}
                      titleTypographyProps={{ align: "center" }}
                      subheaderTypographyProps={{ align: "center" }}
                      action={tier.plan.id === "pro" ? <StarIcon /> : null}
                      className={classes.cardHeader}
                    />
                    <CardContent>
                      <div className={classes.cardPricing}>
                        <Typography
                          component="h2"
                          variant="h3"
                          color="textPrimary"
                        >
                          ${tier.plan.price / 100}
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                          /{tier.plan.period}
                          {tier.plan.period_unit}
                        </Typography>
                      </div>
                      <Typography
                        variant="subtitle1"
                        align="center"
                        // key={line}
                      >
                        {tier.plan.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      {tid === 0 ? (
                        <div style={{ height: "35px" }}></div>
                      ) : (
                        <Button
                          onClick={() => handleCheckout(tier.plan.id, tid)}
                          fullWidth
                          variant="contained"
                          color="primary"
                        >
                          Subscribe
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              )
            )}
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

export default withRouter(connect(mapStateToProps)(MembershipLevel));
