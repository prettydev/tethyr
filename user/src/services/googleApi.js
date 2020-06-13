export const getGoogleApiClient = () => {
  if (window.gapiPromise)
    return window.gapiPromise

  return window.gapiPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/api.js'
    document.head.appendChild(script)
    script.onload = () => {
      const {gapi} = window
      gapi.load('client:auth2', () => {
        resolve(gapi)
      })
    }
  })
}
