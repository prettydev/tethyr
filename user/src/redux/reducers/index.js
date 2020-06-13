import { combineReducers } from 'redux'

import user from './user'
import notificationMessage from './notificationMessage'
import overlaySpinner from './overlaySpinner'
import updateManagement from './updateManagement'
import findStuff from './findStuff'
import viewer from './viewer'
import externalAccounts from './settings/externalAccounts'

export default combineReducers({
  user,
  notificationMessage,
  overlaySpinner,
  updateManagement,
  findStuff,
  viewer,
  externalAccounts,
});
