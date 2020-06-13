export const NotificationColorMode = {
  black: 0,
  red: 1,
  green: 2,
}

export const NotificationPosition = {
  underHeader: 0,
  top: 1,
}

export const ResentLink = {
  on: true,
  off: false,
}

export function showNotificationMessage(message, colorMode, position = NotificationPosition.top, resentLink = ResentLink.off){
  return function(dispatch) {
    const scrollingNode = document.getElementById('app').parentNode

    if (scrollingNode.scrollTo) {
      scrollingNode.scrollTo(0, 0)
    } else {
      scrollingNode.scrollTop = 0
    }
    
    dispatch({ type: 'SHOW_NOTIFICATION_MESSAGE', payload: { message: message, colorMode: colorMode, position: position, resentLink: resentLink } })
  }
}

export function hideNotificationMessage(){
  return function(dispatch) {
    dispatch({ type: 'HIDE_NOTIFICATION_MESSAGE'})
  }
}