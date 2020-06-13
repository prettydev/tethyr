export default function reducer(state = {
  screen: 'public',
}, action) {
  switch(action.type) {
    case 'Public Screen': {
      return { screen: 'public' }
    }
    case 'Promoted Screen': {
      return { screen: 'promoted' }
    }
    case 'Sale Screen': {
      return { screen: 'sale' }
    }
    default: {
      return {...state}
    }
  }
}