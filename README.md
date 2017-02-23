# node-accountant

[![Build Status](https://travis-ci.org/drish/node-accountant.svg?branch=master)](https://travis-ci.org/drish/node-accountant)

A dead simple to use metrics tracker for node.js http services, it optionally sends data to statsD, or simply prints on stdout.

```
npm install node-accountant
```

The goal of this project is to be a simple to use reponse time metrics tracker for http services.
Instead of polluting your application code with metric code, you can use this lib as a
high level middleware if it fits your needs.

## Examples


### stdout

``` js
const ac = require('node-accountant');

app.use(ac({ delimiter: '.' })); // GET.foo.bar - 4.153 ms

app.get('/foo/bar', handler);
```

### statsd

``` js
const ac = require('node-accountant');

const statsdInfo = {
  host: 'localhost',
  port: '9988'
}

// will send statsd info in the following format GET.foo.bar
// statsd.timing('GET.foo.bar', responseTime)
app.use(ac({ statsd: statsdInfo }));

app.get('/foo/bar', handler);
app.post('/fii/bor', handler);
```

### simple middleware callback

``` js
const ac = require('node-accountant');

// will send statsd info in the following format GET.endpoint.action
app.use(ac((req, res, metric) => {
  console.log(metric.responseTime)
  console.log(metric.stat)   // data.stat GET.foo.bar
}));

app.get('/foo/bar', handler);
app.post('/fii/bor', handler);
```

## License

[MIT](https://github.com/drish/accountant/blob/master/LICENSE)
