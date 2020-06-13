import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import asyncComponent from '../../components/AsyncComponent'
import TopHeaderBar from '../../components/TopHeaderBar'
import SettingsBar from '../../components/SettingsBar'
import PlaylistHeaderBar from '../../components/PlaylistHeaderBar'

const AsyncMainView = asyncComponent(() => import('./MainView'))
/**
 * Routes
 */

const routes = (
  <Switch>
    <Route exact path='/viewer' component={ AsyncMainView } />
    <Route path='/viewer/:layout/:playlist_group_id/:playlist_id/:video_id' component={ AsyncMainView } />
    <Redirect to='/viewer' />
  </Switch>
)

export default routes
