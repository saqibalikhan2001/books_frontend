#use an official Node.js image as the base for building the React application
FROM node:14 as build
# Set the working directory in the container
WORKDIR /
# Copy the package.json and package-lock.json files
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code
COPY . .
# Build the React application
RUN npm run build
# Use Nginx to serve the built React application
FROM nginx:alpine
# Copy the built React application from the build stage
COPY --from=build /dist /usr/share/nginx/html 

COPY nginx.conf /etc/nginx/nginx.conf
# Expose the default HTTP port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
