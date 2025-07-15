# Dockerfile.frontend

# --- Stage 1: Build the Vite application ---
# Use a Node.js base image to build the frontend assets
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY .. .

# Build the Vite application for production
# This command generates your static assets into the 'dist' directory
RUN npm run build

# --- Stage 2: Serve the static assets with Nginx ---
# Use a lightweight Nginx image
FROM nginx:alpine

# Copy the built assets from the 'build' stage to Nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Copy a custom Nginx configuration if needed
# If your Vite app uses history mode routing (e.g., for React Router),
# you might need a custom Nginx config to redirect all unknown paths to index.html.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx will listen on (default for HTTP)
EXPOSE 3000

# Nginx serves content by default, no specific CMD needed unless you customize it
CMD ["nginx", "-g", "daemon off;"]