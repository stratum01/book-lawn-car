FROM node:18-alpine

WORKDIR /app

# Copy package.json files
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the frontend
RUN npm run build

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