# README

```bash
 docker build -t ddtramdocker/nodemongohttp2:1.0.0 --build-arg mongodb_container_name=mongodb_mongo_1 --build-arg app_env=dev  .

 docker run --name nodemongohttp2 -p 8000:443 -v /Users/jackwang/Documents/Dev/nodejs/nodeMongodDocker/localhost-cert.pem:/usr/src/app/localhost-cert.pem  -v /Users/jackwang/Documents/Dev/nodejs/nodeMongodDocker/localhost-privkey.pem:/usr/src/app/localhost-privkey.pem  -v /Users/jackwang/Documents/Dev/nodejs/nodeMongodDocker/src:/usr/src/app -v  /Users/jackwang/Documents/Dev/nodejs/nodeMongodDocker/package.json:/usr/src/app/package.json -v /Users/jackwang/Documents/Dev/nodejs/nodeMongodDocker/node_modules:/usr/src/app/node_modules  --network=mongodb_default -d a4fd2d9322a2

Enter mongodb

docker exec -ti nodemongo /bin/bash

curl cmd:
curl -X POST -d {a: '123'} localhost:8000/status
curl localhost:8000
curl localhost:8000 -i

curl https://localhost:8000/status -k
curl https://localhost:8000/status -kiv

```

## Maintance

- Logger sys /lib/logger.js

- Health Check /lib/status.js

- Vertical Scaling pm2

- Horizontal Scaling EC2 or AWS

## http2

use `spdy` module

Nodejs build-in module http2 does not work correctly.

Has some issue, it is does not work with this branch.

```bash
rsa key
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost'  -keyout localhost-privkey.pem -out localhost-cert.pem

```

## Tec

- [http2](https://www.npmjs.com/package/spdy) Nodejs build-in module http2 does not work correctly

- [koa2](https://www.npmjs.com/package/koa2)

- path `build-in`

- [koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser)

- [koa-session2](https://www.npmjs.com/package/koa-session2) session

- [koa-router](https://www.npmjs.com/package/koa-rouuter)

- [koa2-cors](https://www.npmjs.com/package/koa2-cors) Access-Control-Allow-Origin

- [mogodb](https://www.npmjs.com/package/mongo) instrument、 Mongodb native driver

- fs `build-in` file

- [crypto-js](https://www.npmjs.com/package/crypto-js)   encrypt string

- [pm2](https://www.npmjs.com/package/pm2) cluster、Operation and maintenance

- [isredis](https://www.npmjs.com/package/ioredis) redis client

- [uid-safe](https://www.npmjs.com/package/uid-safe) uuid

- [pug](https://pugjs.org/api/getting-started.html) html template

- [winston](https://github.com/winstonjs/winston) logger

- [winston-mongodb](https://www.npmjs.com/package/winston-mongodb)

- [winston-daily-rotate-file](https://www.npmjs.com/package/winston-daily-rotate-file)

----
by jack
