# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose frontend port
EXPOSE 3000

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
