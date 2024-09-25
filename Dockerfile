# Step 1: Use Nginx to serve the built Gatsby site
FROM nginx:alpine

# Build argument to accept the public folder archive
ARG PUBLIC_FOLDER

# Set working directory to serve the site
WORKDIR /usr/share/nginx/html

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the public folder archive from the build context
COPY ${PUBLIC_FOLDER} /tmp/public.tar.gz

# Extract the public folder to Nginx's default static directory
RUN tar -xzvf /tmp/public.tar.gz -C /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
