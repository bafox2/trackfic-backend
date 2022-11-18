#app file is /build/src/app.js
#config folder is in /build/config AND in /config
#we need config to be in /src/config

FROM node:14
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json

RUN rm -rf build
RUN cd /tmp && npm install
ADD ./ /src
RUN rm -rf /src/node_modules && cp -a /tmp/node_modules /src/

WORKDIR /src
RUN npm run build
#config folder is in /build/config AND in /config
#we need config to be in /src/config
RUN cp -a /config build/src/

CMD ["node", "./build/src/app.js"]

