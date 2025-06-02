# ai-search/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

RUN npm install

# Copy all files
COPY . .


EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
