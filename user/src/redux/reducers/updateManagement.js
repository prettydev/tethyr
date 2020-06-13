export default function reducer(state = {
  state: false,
}, action) {
  switch(action.type) {
    case 'UPDATE_STATE_MANAGEMENT': {
      return { state: !state.state }
    }
    default: {
      return {...state}
    }
  }
}
