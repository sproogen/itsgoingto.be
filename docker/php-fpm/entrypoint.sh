#!/bin/bash

php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration

exec "$@"