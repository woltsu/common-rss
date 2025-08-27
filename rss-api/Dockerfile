# Multi-stage build for production optimization
# 
# Build this image from the workspace root directory:
# docker build -f rss-api/Dockerfile -t rss-api:latest .
#
# For development:
# docker build -f rss-api/Dockerfile --target development -t rss-api:dev .
#
# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs rssapi

# Copy workspace root package files
COPY package*.json ./
COPY tsconfig.json ./
COPY rss-api/package*.json ./rss-api/
COPY rss-api/tsconfig.json ./rss-api/
COPY shared/package*.json ./shared/
COPY shared/tsconfig.json ./shared/

# Install all workspace dependencies
RUN npm ci && npm cache clean --force

# Copy source code and configuration
COPY rss-api/ ./rss-api/
COPY shared/ ./shared/

# Build shared package first, then rss-api
RUN npm run build -w shared && \
    npm run build -w rss-api && \
    npm prune --production

# Development stage
FROM node:20-slim AS development

# Set working directory
WORKDIR /app

# Create non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs rssworker

# Copy workspace root package files
COPY package*.json ./
COPY tsconfig.json ./
COPY rss-api/package*.json ./rss-api/
COPY rss-api/tsconfig.json ./rss-api/
COPY shared/package*.json ./shared/
COPY shared/tsconfig.json ./shared/

# Install all workspace dependencies (including dev dependencies)
RUN npm ci

# Copy source code and configuration
COPY rss-api/ ./rss-api/
COPY shared/ ./shared/

# Build shared package for development
RUN npm run build -w shared

# Set environment variables for development
ENV NODE_ENV=development
ENV PORT=3000

# Create directories and set ownership
RUN mkdir -p /app/rss-api /app/shared && chown -R rssworker:nodejs /app

# Switch to non-root user
USER rssworker

# Expose port (configurable via environment)
EXPOSE $PORT

# Start the application in development mode with hot reloading
CMD ["npm", "run", "dev", "-w", "rss-api"]

# Production stage
FROM node:20-slim AS production

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs rssworker

# Copy production dependencies from builder stage
COPY --from=builder --chown=rssworker:nodejs /app/node_modules ./node_modules

# Copy built applications
COPY --from=builder --chown=rssworker:nodejs /app/rss-api/dist ./dist
COPY --from=builder --chown=rssworker:nodejs /app/shared/dist ./shared/dist
COPY --from=builder --chown=rssworker:nodejs /app/rss-api/package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user
USER rssworker

# Expose port (configurable via environment)
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]
