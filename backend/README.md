# Main.py App

## Description
This Python script is setting up a Flask web application with a MySQL database and a Pinecone index.

Here's a breakdown of what each part does:

1. It imports necessary modules and functions. load_qa_chain is likely a function to load a question-answering model. PromptTemplate might be a class or function related to generating prompts. itemgetter is a function for fetching a particular item from its operand. WikipediaAPIWrapper is likely a class or function that wraps around the Wikipedia API to make it easier to use.

2. load_dotenv() is called to load environment variables from a .env file. These variables are often used to store sensitive information like API keys.

3. A new Flask application is created and CORS (Cross-Origin Resource Sharing) is enabled. This allows the server to accept requests from different origins.

4. The app's configuration is set to connect to a MySQL database using SQLAlchemy, which is a SQL toolkit and Object-Relational Mapping (ORM) system for Python. The database URI contains the username, password, host, port, and database name.

5. A migrate object is created, which handles SQLAlchemy database migrations for Flask applications.

6. Pinecone, a vector database service, is initialized with an API key from the environment variables. If an index named "pdfchat" doesn't exist, it creates one with a dimension of 768 and a cosine metric on Google Cloud Platform (GCP) in the 'us-central1' region. This index might be used to store and retrieve vectors, possibly for a machine learning model.

## Installation
1. Change directory to the "/backend"
```
cd .\backend\
``` 
2. Install the required dependencies: `pip install -r requirements.txt`
```
pip install -r requirements.txt
``` 

## Usage
1. Run the main.py file: `python main.py`
```
python main.py
``` 