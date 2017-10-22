FROM gcr.io/google-appengine/nodejs

RUN sudo apt-get install software-properties-common

RUN sudo add-apt-repository ppa:mc3man/trusty-media

RUN sudo apt-get update

RUN sudo apt-get install -y ffmpeg
