#Dowload and use base image from docker
FROM node:18-slim

EXPOSE 8989

# Create and change to the app directory.
WORKDIR /app

RUN npm i npm@latest -g

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . ./

#check files
#RUN ls -la
#RUN ls -la app

# Run the web service on container startup.
CMD [ "npm", "start" ]