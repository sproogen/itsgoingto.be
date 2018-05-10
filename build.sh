#!/bin/bash

docker build -t itsgoingtobe/base -f app/Resources/client/docker/base/Dockerfile app/Resources/client

docker-compose build