FROM node:8.12.0-jessie
# image metadata
LABEL version="1.0.0"
LABEL destription="this is http2 example Dockerfile"
ARG mongodb_container_name
ARG app_env
# Environment variables
# Add/Change/overwritewith docker run --env key=value
ENV NODE_ENV=$app_env
ENV PORT=3000
ENV DB_URI="mongodb://${mongodb_container_name}:27017/db-${app_env}"
# arg -> env -> npm start -> pm2-dev or pm2-docker

# User
RUN npm i -g pm2

# Create API directory
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./package.json .


RUN npm i --production


# ADD

COPY ./src/ .

EXPOSE 3000

CMD ["npm", "start"]



