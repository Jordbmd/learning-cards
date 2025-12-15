FROM node:22-alpine

WORKDIR /app

COPY back/package.json back/package-lock.json ./
RUN npm ci

COPY back .

CMD ["npm", "run", "dev"]
