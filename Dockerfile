FROM node:14


RUN pwd -P
ADD package.json /tmp/package.json
ADD package-lock.json /tmp/package-lock.json
RUN ls
RUN pwd -P

RUN rm -rf build
RUN cd /tmp && npm install
RUN ls

ADD ./ /src
RUN rm -rf /src/node_modules && cp -a /tmp/node_modules /src/
RUN ls

WORKDIR /src
RUN npm run build
RUN ls
RUN pwd -P
RUN cd ./build && ls

CMD ["node", "./build/app.js"]