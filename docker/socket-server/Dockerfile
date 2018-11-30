FROM node:carbon
LABEL maintainer="James Grant <james@jwgmedia.co.uk> (http://jameswgrant.co.uk)"

ENV NPM_CONFIG_LOGLEVEL warn

# Create app directory
RUN mkdir -p /socket-server
WORKDIR /socket-server
COPY package*.json ./

RUN npm install

CMD [ "npm", "start" ]

EXPOSE 8001