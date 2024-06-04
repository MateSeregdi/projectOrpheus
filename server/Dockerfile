FROM node:20.11.1

WORKDIR /server

COPY package*.json ./

RUN npm install

RUN mkdir /server/app

WORKDIR /server/app

COPY . .

ENV PORT=5002

EXPOSE 5002

CMD ["npm", "start"]