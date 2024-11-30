FROM node:lts

WORKDIR /app


COPY *.json ./


RUN npm i


COPY . .


RUN npm run build


ARG DATA_DIR
ARG COUNTRIES
ARG CATEGORIES
ARG LANGUAGES
ARG UPLOADS_DIR


COPY ./scripts/data_dir_init.sh /app/data_dir_init.sh


RUN chmod +x /app/data_dir_init.sh


RUN sh /app/data_dir_init.sh -u "${UPLOADS_DIR}" -d "${DATA_DIR}" -c "${COUNTRIES}" -a "${CATEGORIES}" -l "${LANGUAGES}"

EXPOSE 8000

RUN apt update && apt install nano

CMD ["npm", "run", "start"]