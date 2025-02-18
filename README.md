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

# Post the reviews.csv file to the game_reviews core
docker run --rm -v "$PWD/metacritic_reviews:/mydata" --network=host solr solr post -c game_reviews /mydata/alpha-protocol.csv
```
