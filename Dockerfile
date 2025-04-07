FROM node:18-alpine

WORKDIR /app

# Copy package.json files
COPY server/package*.json ./
RUN npm install

# Create necessary directories
RUN mkdir -p public data

# Copy server code
COPY server/ ./

# Copy frontend build to public directory
COPY dist/ ./public/

# Set environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Expose the port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]