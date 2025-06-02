FROM node:20-alpine


RUN apk add --no-cache ca-certificates curl

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Expose the port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]