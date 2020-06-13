const url = window.location.href;
const isProduction = !(url.includes("localhost") || url.includes("dev"));

const config = {
  isProduction: isProduction,
  apiBaseUrl: isProduction ? 'https://api.tethyr.io/api' : 'https://api.tethyr.dev/api',
  // apiBaseUrl: 'http://localhost:8000/api',

  chargebeeUrl:
    `${process.env.REACT_APP_CHARGEBEE_LIVE_STATE}` === "true"
      ? "tethyr"
      : "tethyr-test",
};
export default config;
