#!/bin/bash

yarn react-scripts build
gitgyarn cap sync
docker start capacitor-builder
docker exec -ti capacitor-builder rm -rf *
docker cp . capacitor-builder:/app
docker exec -ti capacitor-builder app-gradle build
rm -rf dist
mkdir -p dist
docker cp capacitor-builder:/app/android/app/build dist
docker stop capacitor-builder