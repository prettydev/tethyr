import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import VideoDetail from './detail';
import VideosComponent from './home';

const VideosRoute = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/videos' component={VideosComponent} />
            <Route path='/videos/edit' component={VideoDetail} />
        </Switch>
    </BrowserRouter>
)

export default VideosRoute;