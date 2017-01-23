/*!!
 * node-accountant
 * copyright(c) 2017 Carlos Derich (carlosderich@gmail.com)
 * MIT
 */

'use strict';

/**
 * exports
 * @public
 */

module.exports = accountant;

/**
 * deps
 * @private
 */

const onHeaders = require('on-headers');
const StatsD = require('node-statsd');

/**
 * node accountant - track http handlers response times
 * optionally send data to statsd
 *
 * @param  {Function} cb   optional callback
 * @return {Function}      middleware
 * @public
 */

function accountant(opt, cb) {

  var options = opt || {};
  var statsdSet = false;
  var statsdClient;

  if (typeof options == 'function') {
    cb = opt;
  }

  if (typeof cb != 'function') {
    cb = function(){};
  }

  if (options.statsd) {
    statsdSet = true;
    statsdClient = configureStatsd(options.statsd);
  }

  const out = process.stdout;

  return function accountant (req, res, next) {

    res._start = process.hrtime();
    var stat = req.method + req.path.split('/').join(options.delimiter || '.');

    function logRequest () {

      var elapsedTime = process.hrtime(res._start);
      var fmtTime = ((elapsedTime[0] + elapsedTime[1]) * 1e-6).toFixed(opt.precision || 3);

      if (statsdSet) {
        statsdClient.timing(stat, fmtTime);
      } else {
        out.write(stat + ' ' + fmtTime + ' ms\n');
      }

      cb(req, res, { stat: stat, responseTime: elapsedTime });
    };

    onHeaders(res, logRequest);
    next();
  }
}

function configureStatsd(options) {
  var statsdClient = new StatsD(options);

  statsdClient.socket.on('error', error => {
    console.error('[statsd-client] error: ', error);
  });

  return statsdClient;
}
