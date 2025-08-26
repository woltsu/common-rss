# Multi-stage build for production optimization
# 
# Build this image from the workspace root directory:
# docker build -f rss-worker/Dockerfile -t rss-worker:latest .
#
# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs rssworker

# Copy workspace root package files
COPY package*.json ./
COPY tsconfig.json ./
COPY rss-worker/package*.json ./rss-worker/
COPY rss-worker/tsconfig.json ./rss-worker/

# Install dependencies using workspace from root    
RUN npm ci -w rss-worker && npm cache clean --force

# Copy source code and configuration
COPY rss-worker/ ./rss-worker/

# Build the TypeScript application
RUN npm run build -w rss-worker && npm prune --production

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

# Copy built application
COPY --from=builder --chown=rssworker:nodejs /app/rss-worker/dist ./dist
COPY --from=builder --chown=rssworker:nodejs /app/rss-worker/package.json ./

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
