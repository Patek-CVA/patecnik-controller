#!/bin/bash

yarn react-scripts build
yarn capacitor-assets generate --iconBackgroundColor '#eeeeee' --iconBackgroundColorDark '#222222' --splashBackgroundColor '#eeeeee' --splashBackgroundColorDark '#111111'
rm -rf icons
yarn cap sync
docker start capacitor-builder
docker cp . capacitor-builder:/app
docker exec capacitor-builder app-gradle build
rm -rf dist
mkdir -p dist
docker cp capacitor-builder:/app/android/app/build dist
docker stop capacitor-builder