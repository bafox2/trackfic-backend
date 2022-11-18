#!/bin/bash

echo "Deploying to production..."
git pull

echo "Installing dependencies..."
docker-compose up -d --build

