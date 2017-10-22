FROM gcr.io/google-appengine/nodejs

RUN apt-get update && apt-get install -y libav-tools
RUN mkdir /nodejs && curl https://nodejs.org/dist/v0.12.7/node-v0.12.7-linux-x64.tar.gz | tar xvzf - -C /nodejs --strip-components=1

ENV PATH $PATH:/nodejs/bin
CMD["npm","start"]
