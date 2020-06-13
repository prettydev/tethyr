import React from "react";
import { withRouter } from "react-router-dom";
import { Switch, Route, Redirect } from "react-router-dom";

import '../../styles/respo.min.scss'



import asyncComponent from "../../components/AsyncComponent";

const AsyncHome = asyncComponent(() => import("../Home"));
const AsyncNewHome = asyncComponent(() => import("../newHome/Landing"));
const AsyncAuthentication = asyncComponent(() => import("../Authentication"));

// const AsyncViewer = asyncComponent(() => import('../Viewer'))
const AsyncViewer = asyncComponent(() => import("../../screens/VideoPage"));

const AsyncManage = asyncComponent(() => import("../ManagePage"));
const AsyncSettings = asyncComponent(() => import("../Settings"));
const AsyncImport = asyncComponent(() => import("../ImportPage"));
const AsyncMetaEditor = asyncComponent(() => import("../MetaEditor"));
const AsyncMobileView = asyncComponent(() => import("../MobileView"));

const LoggedIn = asyncComponent(() => import("../LoggedIn"));

/**
 * Routes
 */

const Routes = (props) => {
  return (
   
    <Switch>
      <Route exact path="/" component={AsyncNewHome} />
      <Route exact path="/landing" component={AsyncNewHome} />
      <Route path="/LoggedIn" component={LoggedIn} />
      <Route path="/auth" component={AsyncAuthentication} />
      <Route path="/settings" component={AsyncSettings} />
      <Route path="/viewer" component={AsyncViewer} />
      <Route path="/tour" component={LoggedIn} />
      <Route path="/manage" component={AsyncManage} />
      <Route path="/share/:shared_group_id" component={AsyncImport} />
      <Route path="/metaEditor" component={AsyncMetaEditor} />
      <Route path="/mobilewebview" component={AsyncMobileView} />
      <Redirect to="/" />
    </Switch>
   
  );
};

export default withRouter(Routes);
