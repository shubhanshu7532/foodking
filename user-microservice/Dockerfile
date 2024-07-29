# # Use the official Node.js LTS 18 base image
# FROM node:18

# # Set the working directory in the container
# WORKDIR /app

# # Copy package.json and package-lock.json to the container
# COPY package*.json ./

# # delete node_modules folder if exists
# RUN rm -rf node_modules

# # install required packages
# RUN npm install

# # Copy the rest of the application code to the container
# COPY . .

# # Create build
# RUN npm run build

# # Run the web service on container startup.
# CMD [ "npm","run", "fantasy" ]

# # Expose the port on which your Node.js application will run
# EXPOSE 3000

# Stage 1: Build the application
FROM node:18 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the runtime image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json to the working directory
COPY package*.json ./

# Install only production dependencies
RUN npm install

# Copy the build output from the builder stage
COPY --from=builder /usr/src/app/build ./build

# Copy the .env file to the working directory
COPY .env ./

# Set the command to run the application
CMD [ "npm", "run", "user" ]

# Expose the necessary ports
EXPOSE 3000

