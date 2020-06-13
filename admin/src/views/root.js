import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import Login from './Login';
import Main from './Main';

const RootComponent = () => (
    <Router>
        <Switch>
            <Route path='/login' component={Login} />
            <PrivateRoute exact path='/*' component={Main} />
        </Switch>
    </Router>
);

export default RootComponent;
