# Stage 1: Build the application
FROM node:22 AS builder

WORKDIR /usr/src/app

# Copy application dependency manifests to the container.
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .
COPY drizzle ./drizzle

# Generate prisma client
RUN npm run build

# Stage 2: Production environment
# Use the official Puppeteer image which includes all necessary dependencies.
FROM ghcr.io/puppeteer/puppeteer:22.10.0

# The base image already sets the user to 'puppeteer'.
# We'll create and use a directory within the user's home for our app.
WORKDIR /home/puppeteer/app

# Copy built application and dependencies from the builder stage,
# ensuring the 'puppeteer' user owns the files.
COPY --from=builder --chown=puppeteer:puppeteer /usr/src/app/dist ./dist
COPY --from=builder --chown=puppeteer:puppeteer /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=puppeteer:puppeteer /usr/src/app/package.json ./package.json
COPY --from=builder --chown=puppeteer:puppeteer /usr/src/app/contracts ./contracts
COPY --from=builder --chown=puppeteer:puppeteer /usr/src/app/drizzle ./drizzle

# No need to switch users; we are already the 'puppeteer' user.

# Expose port and start the application
EXPOSE 3000
CMD [ "node", "dist/index.js" ]
