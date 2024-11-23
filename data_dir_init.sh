DIR=$1
mkdir -p $DIR >> /dev/null
if [ $? -ne 0 ]; then
  echo "Failed to create directory: $DIR"
  exit 1
fi
chmod -R 777 $DIR
cd $DIR
touch countries.json
touch categories.json
touch languages.json
echo "[]" > countries.json
echo "[]" > categories.json