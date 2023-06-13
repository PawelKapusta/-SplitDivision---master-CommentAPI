FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env .

RUN npm run build

EXPOSE 5004

CMD [ "npm", "start" ]