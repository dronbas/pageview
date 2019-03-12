FROM node:10-alpine as node-package

RUN apk update && apk add --no-cache make gcc g++ python bash git findutils

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci -q

FROM node-package AS build

WORKDIR /app

COPY tsconfig.json tsconfig.json
COPY tslint.json tslint.json
COPY uglify.json uglify.json
COPY src src

RUN npm run build

FROM node-package as node-prod

WORKDIR /app

RUN npm prune --production
RUN cd node_modules && find . -type f -not -name '*.node' -delete && find . -empty -type d -delete

FROM alpine

RUN apk update && apk add --no-cache bash gcc

WORKDIR /app

COPY --from=node-prod /app/node_modules /app/node_modules
COPY --from=build /app/bin/app /app/bin/app

COPY package.json /app

RUN chmod +x /app/bin/app

EXPOSE 3000

CMD ./bin/app
