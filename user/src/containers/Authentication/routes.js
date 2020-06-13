import React from 'react'
//import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'

import asyncComponent from '../../components/AsyncComponent'

const AsyncLogin = asyncComponent(() => import('./LogIn'))
const AsyncSignup = asyncComponent(() => import('./SignUp'))
const AsyncConfirmMail = asyncComponent(() => import('./ConfirmMail'))
const AsyncForgotPassword = asyncComponent(() => import('./ForgotPassword'))
const AsyncResetPassword = asyncComponent(() => import('./ResetPassword'))
//const LoggedIn = asyncComponent(() => import('../LoggedIn'))
/**
 * Routes
 */

const routes = (
  <Switch>
    <Route path='/auth/login' component={ AsyncLogin } />
    <Route path='/auth/signup' component={ AsyncSignup } />
    <Route path='/auth/:unique_id/confirm_verification' component={ AsyncConfirmMail } />
    <Route path='/auth/forgotpassword' component={ AsyncForgotPassword } />
    <Route path='/auth/:unique_id/resetpassword/:token' component={ AsyncResetPassword } />

    <Redirect to='/auth/signup' />
  </Switch>
)

export default routes
