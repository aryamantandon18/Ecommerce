FROM node:18-alpine

# Declare build time env variables
ARG REACT_APP_NODE_ENV
ARG REACT_APP_SERVER_BASE_URL

# set default values for env variables
ENV REACT_APP_NODE_ENV=$REACT_APP_NODE_ENV
ENV REACT_APP_SERVER_BASE_URL=$REACT_APP_SERVER_BASE_URL


WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build    
#Executes the build process, which usually involves compiling the application. The output is typically stored in a dist directory.
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","start"]

