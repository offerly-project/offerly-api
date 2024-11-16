FROM node:lts

WORKDIR /app


COPY *.json ./


RUN npm i


COPY . .


RUN npm run build


ARG DATA_DIR


COPY data_dir_init.sh /app/data_dir_init.sh


RUN chmod +x /app/data_dir_init.sh


RUN sh /app/data_dir_init.sh ${DATA_DIR}


EXPOSE 8000




CMD ["npm", "run", "start"]