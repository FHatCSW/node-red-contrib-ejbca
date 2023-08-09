// rest.js
const https = require('https');

// Function to perform HTTP requests with TLS options
function performRequest(method, url, data, headers, tlsOptions) {
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method,
      url,
      headers,
      ...tlsOptions, // Spread TLS options into the request options
    };

    const req = https.request(requestOptions, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        const response = {
          statusCode: res.statusCode,
          headers: res.headers,
          json: () => JSON.parse(responseData),
        };
        resolve(response);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (method === 'POST' && data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

module.exports = {
  performGetRequest: function (url, headers, tlsConfig) {
    return performRequest('GET', url, null, headers, tlsConfig);
  },
  performPostRequest: function (url, data, headers, tlsConfig) {
    return performRequest('POST', url, data, headers, tlsConfig);
  },
  performDeleteRequest: function (url, headers, tlsConfig) {
    return performRequest('DELETE', url, null, headers, tlsConfig);
  },
};
