FROM node:boron

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN npm install

# Bundle app source
COPY . .

RUN apt-get update && apt-get install -y libav-tools

EXPOSE 3000
CMD [ "npm", "start" ]