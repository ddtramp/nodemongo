# README

```bash
docker build -t ddtramdocker/nodemongo:1.0.0 .

 docker run --name nodemongo -p 8000:3000 -v /Users/jackwang/Documents/Dev/nodejs/nodeMongodDocker/src:/usr/src/app -v  /Users/jackwang/Documents/Dev/nodejs/nodeMongodDocker/package.json:/usr/src/app/package.json -v /Users/jackwang/Documents/Dev/nodejs/nodeMongodDocker/node_modules:/usr/src/app/node_modules --env app_env=dev --env mongodb_container_name=mongodb_mongo_1 --network=mongodb_default -d 0aca605b75d1

Enter mongodb

docker exec -ti nodemongo /bin/bash
 ```

##

- Logger sys /lib/logger.js

- Health Check /lib/status.js

- Horizontal Scaling pm2

- Horizontal Scaling

## Tec

- http

- [koa2](https://www.npmjs.com/package/koa2)

- path

- [koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser)

- [koa-session2](https://www.npmjs.com/package/koa-session2) session

- [koa-router](https://www.npmjs.com/package/koa-rouuter)

- [koa2-cors](https://www.npmjs.com/package/koa2-cors) Access-Control-Allow-Origin

- [mogodb](https://www.npmjs.com/package/mongo) instrument、 Mongodb native driver

- fs file, [buildin]

- [crypto-js](https://www.npmjs.com/package/crypto-js)   encrypt string

- [pm2](https://www.npmjs.com/package/pm2) cluster、Operation and maintenance

- [isredis](https://www.npmjs.com/package/ioredis) redis client

- uid-safe uuid

- [pug](https://pugjs.org/api/getting-started.html) html template

- [winston](https://github.com/winstonjs/winston) logger

- [winston-mongodb](https://www.npmjs.com/package/winston-mongodb)

- [winston-daily-rotate-file](https://www.npmjs.com/package/winston-daily-rotate-file)

----
by jack
