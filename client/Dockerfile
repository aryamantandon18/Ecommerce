FROM node:16

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build    
#Executes the build process, which usually involves compiling the application. The output is typically stored in a dist directory.
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","start"]

