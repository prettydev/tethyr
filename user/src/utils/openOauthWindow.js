export default ({url, width, height}) => {
  const {innerWidth, innerHeight, screen} = window

  const windowWidth = innerWidth ?
    innerWidth : document.documentElement.clientWidth ?
      document.documentElement.clientWidth : screen.windowWidth;

  const windowHeight = innerHeight ?
    innerHeight : document.documentElement.clientHeight ?
      document.documentElement.clientHeight : screen.windowHeight;

  // left and top are 0 if popup is bigger than screen
  const {screenLeft, screenTop} = window

  const left = width > windowWidth ? 0 :
    ((windowWidth / 2) - (width / 2)) + (typeof screenLeft != 'undefined' ? screenLeft : screen.left)

  const top = height > windowHeight ? 0 :
    ((windowHeight / 2) - (height / 2)) + (typeof screenTop != 'undefined' ? screenTop : screen.top)

  window.open(url, '', 'width=' + width +
    ',height=' + height + ',top=' + top + ',left=' + left)

  return new Promise(resolve =>
    window.externalAccountCallback = resolve
  )
}
