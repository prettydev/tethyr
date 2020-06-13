import { combineReducers } from 'redux';

import user from './user';
import overlaySpinner from './overSpinner'

export default combineReducers({
    user,
    overlaySpinner
});
