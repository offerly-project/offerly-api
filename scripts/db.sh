USERNAME=$1
PASSWORD=$2
docker rm -f offerly-db-c
docker run --network=offerly-network --hostname offerly-db -e MONGO_INITDB_ROOT_USERNAME=$USERNAME -e MONGO_INITDB_ROOT_PASSWORD=$PASSWORD -d -v offerly-volume:/data --name offerly-db-c mongo