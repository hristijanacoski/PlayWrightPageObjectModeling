module.exports = {
  setup: function(context, ee, next) {
    // Setup code before tests start
    console.log('Performance test started');
    next();
  },
  
  beforeRequest: function(requestParams, context, ee, next) {
    // Modify requests before they're sent
    requestParams.headers = requestParams.headers || {};
    requestParams.headers['User-Agent'] = 'Artillery-Performance-Test';
    next();
  },
  
  afterResponse: function(requestParams, response, context, ee, next) {
    // Process responses
    if (response.statusCode >= 400) {
      console.error(`Error on ${requestParams.url}: ${response.statusCode}`);
      ee.emit('customError', { statusCode: response.statusCode, url: requestParams.url });
    }
    next();
  },
  
  cleanup: function(context, ee, next) {
    // Cleanup after tests complete
    console.log('Performance test completed');
    next();
  }
};
