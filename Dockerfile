# builder
FROM node:18 as builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build


# runner
FROM node:18

WORKDIR /app

COPY --chown=node:node --from=builder /app .

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]