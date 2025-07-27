# Stage 1: Build the application
FROM node:22 AS builder

WORKDIR /usr/src/app

# Copy application dependency manifests to the container.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this first prevents re-running npm install on every code change.
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .
COPY drizzle ./drizzle

# Generate prisma client
RUN npm run build

# Stage 2: Production environment
FROM node:22-slim

WORKDIR /usr/src/app

# Copy built application and dependencies from the builder stage
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/contracts ./contracts
COPY --from=builder /usr/src/app/drizzle ./drizzle

# Expose port and start the application
EXPOSE 3000
CMD [ "node", "dist/index.js" ]
