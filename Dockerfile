# Use the official Node.js 20 Alpine image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Install Nest.js CLI globally (optional, remove if not needed)
RUN yarn global add @nestjs/cli

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=development

# Start the application in development mode with hot-reloading
CMD ["yarn", "start:dev"]
