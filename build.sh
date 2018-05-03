#!/bin/bash

docker build -t itsgoingtobe/base -f app/Resources/client/dockerfiles/base/Dockerfile app/Resources/client

docker-compose build