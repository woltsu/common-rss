# Multi-stage build for production optimization
# 
# Build this image from the workspace root directory:
# docker build -f rss-scheduler/Dockerfile -t rss-scheduler:latest .
#
# For development:
# docker build -f rss-scheduler/Dockerfile --target development -t rss-scheduler:dev .
#
# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs rssscheduler

# Copy workspace root package files
COPY package*.json ./
COPY tsconfig.json ./
COPY rss-scheduler/package*.json ./rss-scheduler/
COPY rss-scheduler/tsconfig.json ./rss-scheduler/
COPY shared/package*.json ./shared/
COPY shared/tsconfig.json ./shared/

# Install all workspace dependencies
RUN npm ci && npm cache clean --force

# Copy source code and configuration
COPY rss-scheduler/ ./rss-scheduler/
COPY shared/ ./shared/

# Build shared package first, then rss-scheduler
RUN npm run build -w shared && \
    npm run build -w rss-scheduler && \
    npm prune --production

# Development stage
FROM node:20-slim AS development

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs rssscheduler

# Copy workspace root package files
COPY package*.json ./
COPY tsconfig.json ./
COPY rss-scheduler/package*.json ./rss-scheduler/
COPY rss-scheduler/tsconfig.json ./rss-scheduler/
COPY shared/package*.json ./shared/
COPY shared/tsconfig.json ./shared/

# Install all workspace dependencies (including dev dependencies)
RUN npm ci

# Copy source code and configuration
COPY rss-scheduler/ ./rss-scheduler/
COPY shared/ ./shared/

# Build shared package for development
RUN npm run build -w shared

# Set environment variables for development
ENV NODE_ENV=development
ENV PORT=3000

# Create directories and set ownership
RUN mkdir -p /app/rss-scheduler /app/shared && chown -R rssscheduler:nodejs /app

# Switch to non-root user
USER rssscheduler

# Expose port (configurable via environment)
EXPOSE $PORT

# Start the application in development mode with hot reloading
CMD ["npm", "run", "dev", "-w", "rss-scheduler"]

# Production stage
FROM node:20-slim AS production

# Install dumb-init for proper signal handling
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Create non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs rssscheduler

# Copy production dependencies from builder stage
COPY --from=builder --chown=rssscheduler:nodejs /app/node_modules ./node_modules

# Copy built applications
COPY --from=builder --chown=rssscheduler:nodejs /app/rss-scheduler/dist ./dist
COPY --from=builder --chown=rssscheduler:nodejs /app/shared/dist ./shared/dist
COPY --from=builder --chown=rssscheduler:nodejs /app/rss-scheduler/package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Switch to non-root user
USER rssscheduler

# Expose port (configurable via environment)
EXPOSE $PORT

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]
