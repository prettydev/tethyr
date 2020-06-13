const url = window.location.href
const isProduction = !(url.includes('localhost') || url.includes('dev'));

const config = {
  isProduction: isProduction,
  // apiBaseUrl: isProduction ? 'https://api.tethyr.io/api' : 'https://api.tethyr.dev/api',
  apiBaseUrl: 'http://localhost:8080/api',
}

export default config
