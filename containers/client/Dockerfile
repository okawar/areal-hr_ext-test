FROM node:22-alpine as build

WORKDIR /app

COPY client/package*.json ./

RUN npm ci

COPY client ./

ENV NODE_ENV=production

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY containers/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
