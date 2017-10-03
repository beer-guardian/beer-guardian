#!/bin/sh

set -e

docker build -t dyladan/beer-guardian --build-arg CACHE_DATE="$(date)" .
docker push dyladan/beer-guardian:latest

