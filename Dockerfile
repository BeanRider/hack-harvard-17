FROM gcr.io/google-appengine/base

RUN apt-get update -y && apt-get install -y libav-tools && apt-get install --no-install-recommends -y -q curl python build-essential git ca-certificates && apt-get clean && rm /var/lib/apt/lists/*_*
RUN mkdir /nodejs && curl https://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x64.tar.gz | tar xvzf - -C /nodejs --strip-components=1

ENV PATH $PATH:/nodejs/bin
ENV NODE_ENV production
WORKDIR /public
CMD ["npm","start"]
