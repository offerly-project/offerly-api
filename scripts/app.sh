
DB_URL=$1
DATA_DIR='/offerly-data'
COUNTRIES='["United Arab Emirates","USA","Germany","UK"]'
CATEGORIES='["Food","Groceries"]'
LANGUAGES='["ar","en"]'


docker build --build-arg DATA_DIR="$DATA_DIR" --build-arg COUNTRIES="$COUNTRIES" --build-arg CATEGORIES="$CATEGORIES" --build-arg LANGUAGES="$LANGUAGES" -t offerly-node-app ../

docker rm -f offerly-node-app-c

docker run --network=offerly-network \
  -d \
  --hostname offerly-api \
  -p 8000:8000 \
  --name offerly-node-app-c \
  -e DB_URL=$DB_URL \
  -e DATA_DIR=$DATA_DIR \
  -v offerly-static-data="$DATA_DIR" \
  offerly-node-app