FROM phpdockerio/php7-fpm:latest

RUN apt-get update \
    && apt-get -y --no-install-recommends install  php7.0-mysql php7.0-pgsql php7.0-redis php7.0-gd php7.0-mbstring \
    && apt-get clean; rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*


WORKDIR "/var/www/html"