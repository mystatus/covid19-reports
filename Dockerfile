FROM node:14 as buildtime

ARG NPM_TOKEN

ENV NODE_PATH=/usr/local/lib/node_modules/:/usr/local/lib \
    NPM_TOKEN="${NPM_TOKEN}"

WORKDIR /usr/src/covid19-reports

# Install dependencies (including private)
RUN echo //registry.npmjs.org/:_authToken=${NPM_TOKEN} > /usr/src/covid19-reports/.npmrc

COPY . /usr/src/covid19-reports

RUN yarn install

RUN find /usr/src/covid19-reports -name "*.sh" -exec chmod +x {} \;

RUN yarn run build

FROM node:14 as runtime

ARG BUILD_DATE

LABEL maintainer="DDS - Devops <devops@ext-mystatus.dds.mil>" \
      description="This is the docker image for covid19-reports application" \
      vendor="DDS" \
      build-date="${BUILD_DATE}" \
      build-number="${BUILD_NUMBER}"

ENV BUILD_DATE="${BUILD_DATE}" \
    NODE_ENV=prod \
    NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /covid19-reports

COPY --from=buildtime /usr/src/covid19-reports /covid19-reports

EXPOSE 4000

CMD [ "yarn", "start" ]
