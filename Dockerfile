FROM debian:12
LABEL authors="xdcz"
WORKDIR /app


# https://wiki.debian.org/Java
ARG JAVA_VERSION=17
# https://developer.android.com/studio (scroll down)
ARG CMDLINE_TOOLS_ID=10406996


# Update packages and install requirements
RUN apt-get update -qq
RUN apt-get install -y curl unzip


# Install java
RUN apt-get install -y openjdk-${JAVA_VERSION}-jre openjdk-${JAVA_VERSION}-jdk
ENV JAVA_HOME /usr/lib/jvm/java-${JAVA_VERSION}-openjdk-amd64/


# Add scripts
ARG SCRIPTS=${HOME}/scripts
RUN mkdir ${SCRIPTS}
ENV PATH ${PATH}:${SCRIPTS}
## Gradle
RUN printf '#!/bin/bash\ncd /app/android\n./gradlew "$@"' > ${SCRIPTS}/app-gradle
RUN chmod +x ${SCRIPTS}/app-gradle


# Setup android
RUN mkdir /android
ENV ANDROID_HOME /android
## Install command-line tools
RUN curl -fSLo ${ANDROID_HOME}/command-line-tools.zip https://dl.google.com/android/repository/commandlinetools-linux-${CMDLINE_TOOLS_ID}_latest.zip
RUN unzip ${ANDROID_HOME}/command-line-tools.zip -d ${ANDROID_HOME}
RUN rm ${ANDROID_HOME}/command-line-tools.zip
RUN mv ${ANDROID_HOME}/cmdline-tools ${ANDROID_HOME}/_cmdline-tools
RUN mkdir ${ANDROID_HOME}/cmdline-tools
RUN mv ${ANDROID_HOME}/_cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest
ENV PATH ${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin
## Accept all licences
RUN yes | sdkmanager --licenses