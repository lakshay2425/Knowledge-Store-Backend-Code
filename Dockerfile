FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY  . . 

RUN npm prune --omit-dev

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

RUN chown -R appuser:appgroup /app

USER app

EXPOSE 3000

CMD ["node", "app.js"]

