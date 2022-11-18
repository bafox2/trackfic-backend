#app file is /build/src/app.js
#config folder is in /build/config

FROM node:14
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json

RUN rm -rf build
RUN cd /tmp && npm install
ADD ./ /src
RUN rm -rf /src/node_modules && cp -a /tmp/node_modules /src/

WORKDIR /src
RUN npm run build
#copy the config folder to be in the same folder as the app.js
RUN cd config && ls
RUN cd ..
RUN cd build/config && ls


CMD ["node", "./build/src/app.js"]

