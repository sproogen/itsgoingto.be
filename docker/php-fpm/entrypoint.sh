#!/bin/bash

php bin/console doctrine:schema:drop --full-database --force
php bin/console doctrine:schema:drop --full-database --force --env=test

php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration --env=test

php bin/console itsgoingtobe:create-user admin password

exec "$@"