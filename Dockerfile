# Use latest node version 8.x
FROM node:12.18.2



# create app directory in container
# RUN mkdir -p /app

# set /app directory as default working directory
WORKDIR /app

COPY package.json .

RUN npm install

# copy all file from current dir to /app in container

COPY . ./

# expose port 4040
EXPOSE 4040

# cmd to start service
CMD [ "npm", "run" ,"dev"]
