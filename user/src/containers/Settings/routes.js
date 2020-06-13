import React from "react";
import { Switch, Route } from "react-router-dom";
import { isMobileOnly } from "react-device-detect";
import asyncComponent from "../../components/AsyncComponent";
import routes from "config/routes";

const AsyncEditProfile = asyncComponent(() => import("./EditProfile"));
const AsyncMembership = asyncComponent(() => import("./MembershipLevel"));
const AsyncAddCredits = asyncComponent(() => import("./AddCredits"));
const AsyncMobileSettingsMenu = asyncComponent(() =>
  import("./MobileSettingsMenu")
);
const ExternalAccounts = React.lazy(() =>
  import("components/Settings/ExternalAccounts")
);

export default (
  <Switch>
    <React.Suspense fallback={"loading..."}>
      {isMobileOnly && (
        <Route path="/settings/menu" component={AsyncMobileSettingsMenu} />
      )}
      <Route path="/settings/membership" component={AsyncMembership} />
      <Route path="/settings/add_credits" component={AsyncAddCredits} />
      <Route path="/settings/editprofile" component={AsyncEditProfile} />
      <Route
        exact
        path={routes.settings.externalAccounts()}
        component={ExternalAccounts}
      />
    </React.Suspense>
  </Switch>
);
