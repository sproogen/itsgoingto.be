#!/bin/bash

docker build -t itsgoingtobe/app-base -f docker/app-base/Dockerfile app

docker-compose build