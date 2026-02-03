# Use image
FROM node:22-alpine

# Work directory
WORKDIR /app

# Copy requirements
COPY package*.json ./

# Setup dependencies
RUN npm install

# Prisma setup
RUN npm install -g prisma

# Prisma schema
COPY prisma ./prisma/

# Generate prisma client
RUN npx prisma generate

# Copy remains
COPY . .

# Open port
EXPOSE 3000

# Run backend server
CMD [ "npm", "start" ]