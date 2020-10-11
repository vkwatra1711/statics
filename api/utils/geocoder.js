const NodeGeocoder = require('node-geocoder');

const options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: "AIzaSyCcV24ywF1XBY7iFNNUu0FOuxfNYLFZd3k",
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
