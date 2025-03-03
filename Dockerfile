FROM node:lts

WORKDIR /app


COPY *.json ./


RUN npm i


COPY . .


RUN npm run build


EXPOSE 8000

RUN apt update && apt install nano

COPY ./src/templates /app/build/templates


CMD ["npm", "run", "start"]