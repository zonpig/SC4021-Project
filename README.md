# SC4021-Project

----
For the SC4021 project, we are required to build a information retrieval system for sentiment analysis. We have to crawl and obtain a text corpus of a topic based on our own choosing, build a search engine that can perform query and perform sentiment analysis. Our topic of choice is on game reviews. This repository contains the details and work done for the project.

Team Members:

- Bryan Lim Kai Wen
- Celine Chow Yu Ying
- Cheong Jing Wen
- Eric Tan Jun Ren
- Quek Ying En Delaney

The youtube link to a 5 minute video presentation of our project is [here](https://www.youtube.com/).

## Table of Contents

- [SC4021-Project](#sc4021-project)
  - [Table of Contents](#table-of-contents)
  - [Project Preconfigurations](#project-preconfigurations)
  - [Crawling](#crawling)
    - [Running Crawling Scripts](#running-crawling-scripts)
  - [Indexing](#indexing)
    - [Running solr](#running-solr)
  - [UI](#ui)
  - [Classification](#classification)
    - [Key Files](#key-files)
    - [Running Classification Scripts](#running-classification-scripts)
    - [Output](#output)

## Project Preconfigurations

Ensure that you have python3 installed.
Use the below commands to create a virtual environment and required dependencies installed.

```bash
python3 -m venv venv # Create a virtual environment

source venv/bin/activate # Activate the virtual environment (Mac/Linux)
venv\Scripts\activate # Activate the virtual environment (Windows)

pip install -r requirements.txt # Install the required dependencies
```

## Crawling

The `crawling` folder contains the following scripts and subdirectories:

- **Scripts**:
  - `backup.ipynb`: Backup and utility functions for data processing.
  - `csv_combination.ipynb`: Combines cleaned CSV files into consolidated datasets.
  - `data_cleaning.ipynb`: Cleans raw data by removing duplicates, empty rows, and invalid entries.
  - `metacritic_scrapper.ipynb`: Scrapes reviews from Metacritic.
  - `reddit_scrapper.ipynb`: Scrapes reviews from Reddit.
  - `steam_scrapper.ipynb`: Scrapes reviews from Steam.

- **Subdirectories**:
  - `metacritic_reviews`: Contains the raw and cleaned datasets from Metacritic.
  - `reddit_reviews`: Contains the raw and cleaned datasets from Reddit.
  - `steam_reviews`: Contains the raw and cleaned datasets from Steam.
  - `consolidated_reviews`: Contains the consolidated datasets from all sources (including the combined one with all reviews).

### Running Crawling Scripts

1. **Run Individual Scripts**:
     Execute the Jupyter notebooks or Python scripts in the `crawling` folder to scrape, clean, and consolidate data.

2. **Output**:
     Cleaned and consolidated datasets will be saved in the respective subdirectories.

## Indexing

For our project, we are using Apache Solr for indexing and searching our data. The data is stored in a CSV format, which is then indexed by Solr. We are using docker to run Solr, which allows us to easily manage and deploy the Solr instance.

Please download the solrdata folder from the google drive link [here](https://drive.google.com/) and place it in the root directory of the project. The solrdata folder contains the configuration files for Solr (including the schema.xml and solrconfig.xml files) and the already indexed data. The data is stored in the solrdata folder, which is mounted to the Solr container when it is run.

### Running solr

```bash
# Start a Solr container named sc4021 with a pre-created core game_reviews
docker run -d -v "$PWD/solrdata:/var/solr" -p 8983:8983 --name sc4021-solr solr solr-precreate game_reviews
```

## UI

For the UI, we are using Vite with React and Tailwind CSS.

```bash
# Change directory to frontend
cd frontend

# Install package.json (Either npm or yarn)
npm install

# Start Vite Development Server (Either npm or yarn)
npm run dev
```

## Classification

The `classification` folder contains scripts and models for performing sentiment analysis, subjectivity detection, sarcasm detection, and polarity classification. Below is an overview of the key files and their purposes:

### Key Files

- **Scripts**:
  - `data_preprocess.ipynb`: Preprocesses raw data for classification tasks. Also returns the inter-annotator agreement score of the manually labeled data.
  - `basic_classification.ipynb`: Implements basic classification models for subjectivity and polarity detection.
  - `advanced_classification.ipynb`: Implements advanced classification models using RoBERTa and BiLSTM for subjectivity and polarity detection.
  - `sarcasm_detection.ipynb`: Focuses on detecting sarcasm in subjective reviews using RoBERTa and BiLSTM.
  - `label_entire_dataset.ipynb`: Combines subjectivity, sarcasm, and polarity detection to label the entire dataset.
  
- **Models**:
  - `best_subjectivity_detection_model.pkl`: Pre-trained model for subjectivity detection.
  - `best_polarity_detection_model.pkl`: Pre-trained model for polarity detection.
  - `roberta_bilstm_polarity.pth`: Advanced polarity detection model using RoBERTa and BiLSTM.
  - `roberta_bilstm_sarcasm.pth`: Advanced sarcasm detection model using RoBERTa and BiLSTM.

- **Datasets**:
  - `annotated_cleaned.csv`: Cleaned dataset with annotated sentiments.
  - `annotated_microtext_lemma.csv`: Preprocessed dataset with lemmatized text.
  - `train-balanced-sarcasm.csv`: Dataset for training sarcasm detection models.

### Running Classification Scripts

1. **Preprocessing**:
     - Run `data_preprocess.ipynb` to clean and preprocess the raw data.

2. **Basic Classification**:
     - Use `basic_classification.ipynb`  to train basic ML models (Logistic Regression, SVM, etc.) for subjectivity and polarity detection.

3. **Advanced Classification**:
        - Use `advanced_classification.ipynb` to train advanced models (RoBERTa, BiLSTM) for subjectivity and polarity detection.

4. **Sarcasm Detection**:
     - Run `sarcasm_detection.ipynb` to detect sarcasm in subjective reviews.

5. **Label Entire Dataset**:
     - Execute `label_entire_dataset.ipynb` to combine all classification tasks and label the entire dataset.

Note: Running 3,4,5 on a GPU is recommended for faster training and inference times. The models are trained using PyTorch and Hugging Face Transformers.

### Output

The labeled datasets and trained models will be saved in the `classification` folder for further use in the project.
