#app file is /build/src/app.js
#config folder is in /build/config AND in /config
#we need config to be in /src/config

FROM node:18.12.1
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json

RUN rm -rf build
RUN cd /tmp && npm install
ADD ./ /src
RUN rm -rf /src/node_modules && cp -a /tmp/node_modules /src/

WORKDIR /src
RUN npm run build
#check if there is an env file in the ./build foler



#config folder is in /build/config AND in /config
#we need config to be in /src/config
# RUN cp -a config build/src/
# RUN cd build/src && ls
# RUN cd config && ls

CMD ["node", "./build/src/app.js"]

