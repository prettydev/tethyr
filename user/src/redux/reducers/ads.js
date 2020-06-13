export default function reducer(state = {
    items: [],
  }, action) {
    switch(action.type) {
      case 'SET_ALL_ADS': {
        return { ads: action.ads }
      }
      default: {
        return {...state}
      }
    }
  }
  