# Build stage for frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Copy server files
COPY server/package*.json ./
RUN npm install --production
COPY server ./

# Copy built frontend
COPY --from=frontend-builder /app/dist ./public

# Environment variables
ENV PORT=8080
ENV NODE_ENV=production

# Start server
EXPOSE 8080
CMD ["node", "server.js"]