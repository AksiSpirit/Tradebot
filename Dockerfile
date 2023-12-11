FROM node:alpine

WORKDIR /tradebot

COPY config.json ./

COPY buttons ./
COPY commands ./
COPY loops ./
COPY modals ./
COPY selectmenus ./

COPY package.json ./
COPY bot.js ./

RUN npm i --silent

CMD ["npm", "start"]