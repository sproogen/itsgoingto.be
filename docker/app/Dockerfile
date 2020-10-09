FROM itsgoingtobe/app-base:latest
LABEL maintainer="James Grant <james@jwgmedia.co.uk> (http://jameswgrant.co.uk)"

COPY ./ ./

ENV CHOKIDAR_USEPOLLING "true"

CMD [ "npm", "start" ]
