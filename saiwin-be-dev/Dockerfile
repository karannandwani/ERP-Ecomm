FROM ubuntu:bionic as build-server
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs
RUN apt install -y git
RUN npm install -g nodemon
WORKDIR /build
COPY ./ ./
RUN git config --global url."https://".insteadOf git://
RUN npm install
ENV HOST 0.0.0.0
EXPOSE 5000
CMD ["nodemon", "src/server.js", "0.0.0.0", "5000"]