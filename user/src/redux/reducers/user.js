export default function reducer(state = {
  user: {},
  loggingIn: false,
  loggedIn: false,
  error: null,
}, action) {
  switch(action.type) {

    case 'LOGIN_USER': {
      return {...state, loggingIn: true, loggedIn: false}
    }

    case 'LOGIN_USER_FULFILLED': {
      return {...state, loggingIn: false, loggedIn: true, user: action.payload}
    }

    case 'LOGIN_USER_REJECTED': {
      return {...state, loggingIn: false, loggedIn: false, error: action.payload}
    }

    case 'SIGNUP_USER': {
      return {...state, loggingIn: true}
    }

    case 'SIGNUP_USER_FULFILLED': {
      return {...state, loggingIn: false, loggedIn: true, user: action.payload}
    }

    case 'SIGNUP_USER_REJECTED': {
      return {...state, loggingIn: false, loggedIn: false, error: action.payload}
    }

    case 'CONFIRM_USER_LOGIN_REJECTED': {
      return {...state, loggingIn: false, loggedIn: true, error: action.payload}
    }

    case 'CONFIRM_USER_SIGNUP_REJECTED': {
      return {...state, loggingIn: false, loggedIn: false, error: action.payload}
    }

    // case 'LOGIN_USER_REJECTED': {
    //   return {...state, loggingIn: false, loggedIn: false, error: action.payload}
    // }

    case 'UPDATE_USER': {
      return {...state}
    }

    case 'UPDATE_USER_FULFILLED': {
      return {...state, loggingIn: false, loggedIn: true, user: action.payload}
    }

    case 'UPDATE_USER_REJECTED': {
      return {...state, error: action.payload}
    }

    case 'LOGOUT_USER_FULFILLED': {
      return {...state, user: action.payload, loggedIn: false}
    }

    default: {
      return {...state}
    }

  }
}
