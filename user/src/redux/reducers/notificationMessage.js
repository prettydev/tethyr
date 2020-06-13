export default function reducer(state = {
  message: '',
  colorMode: -1,
  position: -1,
  resentLink: false,
  visible: false,
}, action) {
  switch(action.type) {
    case 'SHOW_NOTIFICATION_MESSAGE': {
      return { visible: true, colorMode: action.payload.colorMode, message: action.payload.message, position: action.payload.position, resentLink: action.payload.resentLink }
    }
    case 'HIDE_NOTIFICATION_MESSAGE': {
      return { visible: false, colorMode: -1, message: '', position: -1, resentLink: false }
    }
    default: {
      return {...state}
    }
  }
}