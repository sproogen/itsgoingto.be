FROM node:carbon
LABEL maintainer="James Grant <james@jwgmedia.co.uk> (http://jameswgrant.co.uk)"

ENV NPM_CONFIG_LOGLEVEL warn

# Create app directory
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./

RUN npm install