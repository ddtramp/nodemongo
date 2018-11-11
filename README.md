# README

// TODO Authentication
// sql 注入
// csrf done
// koa-compress gzip
// koa-helmet security
// koa-valivate
// TODO redis cluster
// TODO mogodb cluster
// TODO logic server custer
// add dev pm2.yml file https://segmentfault.com/q/1010000004131939

```bash
 docker build -t ddtramdocker/nodemongohttp2:1.0.0 --build-arg mongodb_container_name=mongodb_mongo_1 --build-arg app_env=dev  .

server version:
 docker run --name nodemongohttp2 -p 8000:443 -v /usr/local/Dev/nodejs/nodeMongodDocker/localhost-cert.pem:/usr/src/app/localhost-cert.pem  -v /usr/local/Dev/nodejs/nodeMongodDocker/localhost-privkey.pem:/usr/src/app/localhost-privkey.pem  -v /usr/local/Dev/nodejs/nodeMongodDocker/src:/usr/src/app -v  /usr/local/Dev/nodejs/nodeMongodDocker/package.json:/usr/src/app/package.json -v /usr/local/Dev/nodejs/nodeMongodDocker/node_modules:/usr/src/app/node_modules  --network=mongodb_default -d edfef709a0a6

mount nfs

  mount -t nfs -o rw,vers=3,tcp,fsc,actimeo=1 192.168.2.132:/Users/jackwang/Documents/Dev /usr/local/Dev/

  -o list , 号分割

sslocal

  docker run -dt --name ss -p 1080:1080 --network=mongodb_default mritd/shadowsocks -m "ss-local" -s "-s 107.182.29.86 -p 8443 -l 1080 -k NWY5ZGMxZj -m aes-256-cfb -b 0.0.0.0 "

docker run -dt --name ssclient -p 1080:1080 mritd/shadowsocks -m "ss-local" -s "-s 127.0.0.1 -p 6500 -b 0.0.0.0 -l 1080 -m chacha20 -k test123 --fast-open" -x -e "kcpclient" -k "-r SSSERVER_IP:6500 -l :6500 -mode fast2"
// todo ss server not done

 local version:
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

- [crypto-js](https://www.npmjs.com/package/crypto-js)   encrypt string use bcrypt -- deprecated

- [bcrypt](https://www.npmjs.com/package/bcrypt) install error, change to bcryptjs

- [bcryptjs](https://www.npmjs.com/package/bcryptjs)

- [pm2](https://www.npmjs.com/package/pm2) cluster、Operation and maintenance

- [isredis](https://www.npmjs.com/package/ioredis) redis client

- [uid-safe](https://www.npmjs.com/package/uid-safe) uuid

- [pug](https://pugjs.org/api/getting-started.html) html template

- [winston](https://github.com/winstonjs/winston) logger

- [winston-mongodb](https://www.npmjs.com/package/winston-mongodb)

- [winston-daily-rotate-file](https://www.npmjs.com/package/winston-daily-rotate-file)

- [acl](https://github.com/OptimalBits/node_acl) NODE ACL - Access Control Lists for Node

- [koa-crsf](https://www.npmjs.com/package/koa-csrf)  Cross site request forgery

- [parameter](https://www.npmjs.com/package/parameter) validate user input

- [jwt|jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

- [nodemailer](https://www.npmjs.com/package/nodemailer) send email see lib/send-email.js

- [socks](https://www.npmjs.com/package/socks) for nodemailer proxy, socks support
----
by jack
