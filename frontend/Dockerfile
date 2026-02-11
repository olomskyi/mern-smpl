
ARG NODE_VERSION=24.11.0

# Use image
FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /app/src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/src/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
