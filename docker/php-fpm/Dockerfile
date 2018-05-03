FROM phpdockerio/php7-fpm:latest
LABEL maintainer="James Grant <james@jwgmedia.co.uk> (http://jameswgrant.co.uk)"

RUN apt-get update \
    && apt-get -y --no-install-recommends install  php7.0-mysql php7.0-pgsql php7.0-redis php7.0-gd php7.0-mbstring dos2unix \
    && apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*

COPY entrypoint.sh /usr/local/bin/

RUN dos2unix /usr/local/bin/entrypoint.sh && apt-get --purge remove -y dos2unix

RUN chmod +x /usr/local/bin/entrypoint.sh
RUN ln -s usr/local/bin/entrypoint.sh /

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]

WORKDIR /var/www/html