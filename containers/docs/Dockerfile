FROM node:22-alpine
WORKDIR /app

COPY vitepressDocs/package*.json ./

RUN npm install
COPY vitepressDocs/vitepressDocs /app/vitepressDocs

RUN mkdir -p /app/vitepressDocs/.vitepress

RUN ls -la /app/vitepressDocs/.vitepress/

RUN npm run docs:build -- --ignore-dead-links

CMD ["sh", "-c", "tail -f /dev/null"]