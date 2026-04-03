FROM node:24-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++ bash

# Install corepack and enable yarn
RUN corepack enable && corepack prepare yarn@4.13.0 --activate

# Copy package files
COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies
RUN yarn install --immutable

# Copy source code
COPY . .

# Build frontend and backend
RUN yarn workspace twenty-shared build && \
    yarn workspace twenty-server build

# Expose backend port
EXPOSE 3001

# Set environment
ENV NODE_ENV=production

# Start backend
CMD ["node", "packages/twenty-server/dist/main.js"]
