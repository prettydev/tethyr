const isEncoded = (uri) => {
  uri = uri || '';
  return uri !== decodeURI(uri);
}

const decodeString = (str) => {
  if (isEncoded(str)) return decodeURI(str);
  return str;
}

module.exports = {
  decodeString
}
