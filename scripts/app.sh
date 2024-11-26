
DB_URL=$1
DATA_DIR='/etc/offerly-data'
COUNTRIES='["USA", "UAE"]'
CATEGORIES='["Food", "Groceries"]'
LANGUAGES='["en", "ar"]'


docker build --build-arg DATA_DIR="$DATA_DIR" --build-arg COUNTRIES="$COUNTRIES" --build-arg CATEGORIES="$CATEGORIES" --build-arg LANGUAGES="$LANGUAGES" -v offerly-static-data="$DATA_DIR" -t offerly-node-app ../

docker rm -f offerly-node-app-c

docker run --network=offerly-network \
  -d \
  -p 8000:8000 \
  --name offerly-node-app-c \
  -e DB_URL=$DB_URL \
  offerly-node-app