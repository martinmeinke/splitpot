# Dockerfile for Fly.io deployment
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

# Expose the port that your Express app listens on
EXPOSE 8080

# Start the application
CMD ["node", "server.js"]