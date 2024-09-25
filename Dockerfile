# Step 1: Use Node.js with required build dependencies
FROM node:18-alpine AS build

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev

# Set environment variable to use prebuilt binaries for sharp
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Set Python 3 as the default
RUN ln -sf python3 /usr/bin/python

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --unsafe-perm

# Copy the rest of the application
COPY . .

# Build the Gatsby site
RUN npm run build

# Step 2: Serve the built Gatsby site with Nginx
FROM nginx:alpine

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy Gatsby's build output from the 'build' stage
COPY --from=build /app/public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
