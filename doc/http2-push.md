# README

Actually， there have two way push data to client

all ways to Rome

## current use mainfest.json

use http2-pusher middleware, can be exactly control the assets
```js
  src/lib/http2-pusher.js
```

## second

the push data from the html file, we can use middleware check the assets from html string

in this project, we can do this at `/lib/template.js` middleware

see [https://github.com/azat-co/http2-node-server-push/blob/master/index-advanced.js](https://github.com/azat-co/http2-node-server-push/blob/master/index-advanced.js)

----

by jack
