FROM node:latest

#Set enviroment variables
ENV appDir /var/www/app

# Create app directory
RUN mkdir -p $appDir
WORKDIR ${appDir}

# Install app dependencies
ADD package.json /var/www/app/
RUN npm i -g yarn
RUN yarn

# Bundle app source
ADD . /var/www/app

# Exposing app port
EXPOSE 2525

# Staring App
CMD ["npm","start"]
