FROM node:18-alpine

WORKDIR /app

# Copy package.json files
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the frontend
RUN npm run build

# Create server/public directory and copy build files there
RUN mkdir -p server/public
RUN cp -r dist/* server/public/

# Set up server
WORKDIR /app/server
RUN npm install

# Create data directory
RUN mkdir -p data

# Environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Expose the port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]