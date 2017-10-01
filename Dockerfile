FROM node:8.4-alpine

ENV ENVIRONMENT_REFRESH 2017-09-14-3

WORKDIR /opt/guardian

COPY package.json ./

RUN apk add --no-cache make gcc g++ python git && \
    npm install --build-from-source=bcrypt && \
    apk del make gcc g++ python git

ENV ENVIRONMENT_REFRESH_SRC 2

COPY src src

EXPOSE 3000

CMD ["npm", "start"]
