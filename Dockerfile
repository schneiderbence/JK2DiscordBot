FROM node:16
RUN mkdir -p /user/src/app
WORKDIR /user/src/app
COPY package*.json ./
COPY . .
RUN npm install
CMD ["node", "bot.js"]
