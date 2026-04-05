FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Set environment variables
ENV PORT=12345
ENV MONGO_URL=mongodb://host.docker.internal:27017

EXPOSE 12345

CMD [ "npm", "start" ]
