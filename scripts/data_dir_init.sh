COUNTRIES="[]"
CATEGORIES="[]"
LANGUAGES="[]"

while getopts "hv:a:d:c:l:u:d:" opt; do
  case $opt in
    h)
      echo "Usage: data_dir_init.sh [-h] [-v] [-d <directory>] [-c <countries>] [-l <languages>]"
      echo "  -h  Display this help message."
      echo "  -v  Verbose mode."
      echo "  -d  Data directory"
      echo "  -u  Uploads directory"
      echo "  -c  Specify countries (JSON format)."
      echo "  -a  Specify categories (JSON format)."
      echo "  -l  Specify languages (JSON format)."
      exit 0
      ;;
    d)
      DIRECTORY=$OPTARG
      ;;
    c)
      COUNTRIES=$OPTARG
      ;;
    a)
      CATEGORIES=$OPTARG
      ;;
    u)
      UPLOADS_DIRECTORY=$OPTARG
      ;;
    l)
      LANGUAGES=$OPTARG
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done


if [ -z "$DIRECTORY" ]; then
  echo "Error: Directory is required (-d <directory>)"
  exit 1
fi

if [ -z "$UPLOADS_DIRECTORY" ]; then
  echo "Error: Uploads directory is required (-u <directory>)"
  exit 1
fi



mkdir -p "$UPLOADS_DIRECTORY" 
mkdir -p "$UPLOADS_DIRECTORY/banks" 
mkdir -p "$UPLOADS_DIRECTORY/cards" 
mkdir -p "$UPLOADS_DIRECTORY/offers" 

mkdir -p "$DIRECTORY"

touch "$DIRECTORY/countries.json" 
touch "$DIRECTORY/categories.json" 
touch "$DIRECTORY/languages.json" 


echo "$COUNTRIES" > "$DIRECTORY/countries.json"
echo "$CATEGORIES" > "$DIRECTORY/categories.json"
echo "$LANGUAGES" > "$DIRECTORY/languages.json"
