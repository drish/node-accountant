var http = require('http');
var request = require('supertest');
var express = require('express');
var assert = require('assert');

var accountant = require('..');

describe('accountant', function () {

  it('simple metric middleware', function (done) {

    var app = express();

    app.use(accountant(function(req, res, metric) {
      assert.equal(metric.stat, 'POST.foo.bar');
      assert.ok(metric.responseTime);
      done();
    }));

    app.post('/foo/bar', (req, res ) => {
      return res.send({ ok: true });
    });

    app.put('/foo/bar', (req, res ) => {
      return res.send({ ok: true });
    });

    request(app)
    .post('/foo/bar')
    .set('Content-Type', 'application/json')
    .expect(200)
    .end();
  });

  it('custom delimiter', function (done) {

    var app = express();

    app.use(accountant({ delimiter: '-' }, function(req, res, metric) {
      assert.equal(metric.stat, 'POST-foo-bar');
      assert.ok(metric.responseTime);
      done();
    }));

    app.post('/foo/bar', (req, res ) => {
      return res.send({ ok: true });
    });

    app.put('/foo/bar', (req, res ) => {
      return res.send({ ok: true });
    });

    request(app)
    .post('/foo/bar')
    .set('Content-Type', 'application/json')
    .expect(200)
    .end();
  });

  it('no callback', function (done) {

    var app = express();

    app.use(accountant({ delimiter: '-' }));

    app.post('/foo/bar', (req, res ) => {
      return res.send({ ok: true });
    });

    app.put('/foo/bar', (req, res ) => {
      return res.send({ ok: true });
    });

    request(app)
    .post('/foo/bar')
    .set('Content-Type', 'application/json')
    .expect(200)
    .end(done);
  });

  it('statsd', function (done) {

    var app = express();

    app.use(accountant(
      {
        statsd: { host: '10.10.10.1' }
      }
    ));

    app.post('/foo/bar', (req, res ) => {
      return res.send({ ok: true });
    });

    app.put('/foo/bar', (req, res ) => {
      return res.send({ ok: true });
    });

    request(app)
    .post('/foo/bar')
    .set('Content-Type', 'application/json')
    .expect(200)
    .end(done);
  });

});
