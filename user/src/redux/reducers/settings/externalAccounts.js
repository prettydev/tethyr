import {
  LOAD_ACCOUNTS,
  ADD_ACCOUNT,
  REMOVE_ACCOUNT,
  ADD_ACCOUNT_ERROR
} from 'redux/actions/settings/externalAccounts'

export default (state = {
  accounts: {},
  error: null,
}, action) => {
  switch(action.type) {
    case LOAD_ACCOUNTS: {
      return {...state, accounts: action.payload}
    }
    case ADD_ACCOUNT: {
      const {type, username} = action.payload
      return {...state, accounts: {...state.accounts, [type]: username}}
    }
    case REMOVE_ACCOUNT: {
      const {
        // [action.payload.type]: removed, 
        newState} = state
      return newState
    }
    case ADD_ACCOUNT_ERROR:
      return {...state, error: action.payload}
    default:
      return state
  }
}
