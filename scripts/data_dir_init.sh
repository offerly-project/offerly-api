COUNTRIES="[]"
CATEGORIES="[]"
LANGUAGES="[]"

while getopts "hv:a:d:c:l:" opt; do
  case $opt in
    h)
      echo "Usage: data_dir_init.sh [-h] [-v] [-d <directory>] [-c <countries>] [-l <languages>]"
      echo "  -h  Display this help message."
      echo "  -v  Verbose mode."
      echo "  -d  Specify the directory to create."
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


mkdir -p "$DIRECTORY" 
mkdir -p "$DIRECTORY/banks" 
mkdir -p "$DIRECTORY/cards" 
mkdir -p "$DIRECTORY/offers" 


touch "$DIRECTORY/countries.json" 
touch "$DIRECTORY/categories.json" 
touch "$DIRECTORY/languages.json" 


if [ ! -s "$DIRECTORY/countries.json" ] || [ "$COUNTRIES" != "[]" ]; then
  echo "$COUNTRIES" > "$DIRECTORY/countries.json"
fi

if [ ! -s "$DIRECTORY/categories.json" ] || [ "$CATEGORIES" != "[]" ]; then
  echo "$CATEGORIES" > "$DIRECTORY/categories.json"
fi

if [ ! -s "$DIRECTORY/languages.json" ] || [ "$LANGUAGES" != "[]" ]; then
  echo "$LANGUAGES" > "$DIRECTORY/languages.json"
fi