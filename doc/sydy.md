# [spdy](https://github.com/spdy-http2/node-spdy)

## attention

Use `spdy` module with `http2-pusher.js`

The mainfest.json format is:

```json
{
  "/static/images/favicon.ico": {
    "priority": 1,
    "type": "img"
  },
  "/static/css/common-layout.css": {
    "priority": 1,
    "type": "style"
  },
  "/static/plugins/bootstrap-4.0.0-dist/css/bootstrap.min.css": {
    "priority": 1,
    "type": "style"
  },
  "/static/plugins/jquery-3.3.1/jquery-3.3.1.min.js": {
    "priority": 2,
    "type": "script"
  },
  "/static/plugins/bootstrap-4.0.0-dist/js/bootstrap.min.js": {
    "priority": 2,
    "type": "script"
  }
}
```

`proprity` field config stream priority 1 - 256
[https://github.com/spdy-http2/spdy-transport/blob/master/lib/spdy-transport/connection.js](https://github.com/spdy-http2/spdy-transport/blob/master/lib/spdy-transport/connection.js)

[https://github.com/spdy-http2/node-spdy/blob/master/lib/spdy/response.js](https://github.com/spdy-http2/node-spdy/blob/master/lib/spdy/response.js)

1 is most important, means stream has higer priority

[https://httpwg.org/specs/rfc7540.html#StreamPriority](https://httpwg.org/specs/rfc7540.html#StreamPriority)

## doc

- [Hypertext Transfer Protocol Version 2 (HTTP/2)](https://httpwg.org/specs/rfc7540.html)

- [spdy](https://github.com/spdy-http2/node-spdy)

## issue

- It seems some browsers may use "upgrade: h2" header to up an connection from plain http to http2 (without tls, so NPN/ALPN unavailable)

[auto protocol upgrade from http/1.x to h2](https://github.com/spdy-http2/node-spdy/issues/243)

- maybe have priority issue
