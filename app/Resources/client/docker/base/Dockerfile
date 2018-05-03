FROM node:carbon

ENV NPM_CONFIG_LOGLEVEL warn

# Create app directory
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./

RUN npm install