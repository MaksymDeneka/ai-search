# web-unlock/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

RUN npm install

# Copy all files
COPY . .

# Expose the port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]