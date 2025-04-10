# SC4021-Project

## Create venv

```bash
python3 -m venv venv
source venv/bin/activate
```

## Running solr

```bash
# Start a Solr container named sc4021 with a pre-created core game_reviews
docker run -d -v "$PWD/solrdata:/var/solr" -p 8983:8983 --name sc4021-solr solr solr-precreate game_reviews
xx# store the mock_data file from gdrive into data folder, then run 
docker run --rm -v "$PWD/data:/mydata" --network=host solr solr post -c game_reviews /mydata/mock_data.csv

```

## Running frontend

```bash
# Change directory to frontend
cd frontend

# Install package.json (Either npm or yarn)
npm install
yarn install

# Start Vite Development Server (Either npm or yarn)
npm run dev
yarn dev

````

## To currently query

platform : field
