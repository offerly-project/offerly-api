USERNAME=$1
PASSWORD=$2
export DB_URL="mongodb://$USERNAME:$PASSWORD@offerly-db:27017/offerly"
export DATA_DIR='/offerly-data'
export UPLOADS_DIR='/offerly-uploads'
COUNTRIES='["Saudi Arabia"]'
CATEGORIES='["Shopping","Travel","Restaurants & Cafes","Entertainment","Car Services","Health & Wellness","Others","Groceries"]'
LANGUAGES='["ar","en"]'


docker build --build-arg UPLOADS_DIR="$UPLOADS_DIR" --build-arg DATA_DIR="$DATA_DIR" --build-arg COUNTRIES="$COUNTRIES" --build-arg CATEGORIES="$CATEGORIES" --build-arg LANGUAGES="$LANGUAGES" -t offerly-node-app ../

docker rm -f offerly-node-app-c

docker run --network=offerly-network \
  -d \
  --hostname offerly-api \
  --name offerly-node-app-c \
  -e DB_URL=$DB_URL \
  -e DATA_DIR=$DATA_DIR \
  -e NODE_ENV=production \
  -e UPLOADS_DIR=$UPLOADS_DIR \
  -v offerly-uploads:$UPLOADS_DIR \
  offerly-node-app