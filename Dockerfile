# Step 1: Use an official Node.js image as the base
FROM node:20 AS build

# Step 2: Set the working directory
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json into the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the entire project into the container
COPY . .

# Step 6: Build the Gatsby site
RUN npm run build

# Step 7: Use an Nginx image to serve the built site
FROM nginx:alpine
COPY --from=build /usr/src/app/public /usr/share/nginx/html

# Expose the port Nginx will run on
EXPOSE 80

# Step 8: Start Nginx server
CMD ["nginx", "-g", "daemon off;"]