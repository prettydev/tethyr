const fetch = async (method, path, options, data) => {
  options.method = method
  if (!options.headers) options.headers = {}
  const token = sessionStorage.getItem('token')
  options.headers['x-access-token'] = token

  if (data) {
    options.body = JSON.stringify(data)
    options.headers['Content-Type'] = 'application/json'
  }

  let result = await window.fetch(`${process.env.REACT_APP_SERVER_URL}${path}`, options)
  const contentType = result.headers.get('Content-Type')
  if (contentType && contentType.includes('application/json'))
    result = await result.json()

  return result
}

export default {
  get: (path, options = {}) =>
    fetch('GET', path, options),

  post: (path, data, options = {}) =>
    fetch('POST', path, options, data),

  delete: (path, data, options = {}) =>
    fetch('DELETE', path, options, data)
}
