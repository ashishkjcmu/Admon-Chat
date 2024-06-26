# AdmonChat

AdmonChat is a tool which provides more insights to any company. There are two ways of using it:

 1. Providing the company report (PDF)
 2. Providing the company name (Data retrieved from Wikipedia)

Using these data sources the app utilizes the concept of RAG(Retrieval Augmented Generation) and  creates a custom QA chat interface to ask queries.

## Tech Stack
 - Flask for backend
 - NextJS for frontend
 - Shadcn for UI/UX
 - Pinecone for vector database
 - Langchain for retrieval chatbot
 - Clerk for authentication
 - Huggingface to create embeddings
 - SQLAlchemy to store data in MySQL form
 - OpenAI 

## Theory and Implementation
AdmonChat uses LangChain to develop custom chatbots that provide specific answers based on provided company data. LangChain provides a series of components to load any data sources. It supports a vast number of data sources and transformers to convert into a series of strings to store in vector databases. Once the data is stored in a database one can query the database using components called retrievers.
![LangChain Ecosystem](https://miro.medium.com/v2/resize:fit:828/format:webp/0*_GJt-W3UO6RABLfn.png)

As mentioned before the data sources in AdmonChat can be provided in form of:

 1. PDF reports
 2. Company name (which is used to extract more info using wikipedia)

The workflow on creating a chatbot using this data source has the following steps:
1.  **Document loaders:** To load user documents for vectorization and storage purposes
2.  **Text splitters**: These are the document transformers that transform documents into fixed chunk lengths to store them efficiently. The application uses _RecursiveCharacterTextSplitter_ for this purpose.
3.  **Vector storage:**  Vector database integrations to store vector embeddings of the input texts. Huggingface is used for creating these embeddings.
4.  **Document retrieval:** To retrieve texts based on user queries to the database. They use similarity search techniques to retrieve the same. Langchain is used for document retrieval.
5.  **Model output:**  Final model output to the user query generated from the input prompt of query and retrieved texts.

AdmonChat uses Huggingface for creating embeddings (hence it has a overhead for installing dependencies when the backend is run the first time) and Pinecone as the vector database (it is cloud-native vector database so easy to manage). Pinecone is very well suited for AdmonChat since it is optimized to store and query a large number of vectors with low latency.  The Pinecone index is named "pdfchat" and has a dimension of 768 and a cosine metric on Google Cloud Platform (GCP) in the 'us-central1' region.

![Implementation workflow](https://miro.medium.com/v2/resize:fit:828/format:webp/1*4eNVj29I1HIeNspOykcAOA.png)

 This is the AI used in the application. NextJS along with shadn is used for creating a frontend along with Flask for backend(CORS (Cross-Origin Resource Sharing) is enabled). SQLAlchemy is used along with MySQL as database. SQLAlchemy allows performing ORM tasks without database dependency making migration and scaling easy.

The database stores information regarding different chat instances for each user along with the messages inside. For each message generated by the AI there is a feedback mechanism. A user can provide:
- a positive(1 in database) 
or 
- a negative(-1 in database) feedback 

to any message. Each user can have multiple chat instances each with its own context and chat history (stored using the database mechanism discussed above).

## Features

The application that allows users to upload PDF files or a company name. The backend then generates a vector store using LangChain, PineCone, and Huggingface embeddings. These are used in a Retrieval Augmented Generation (RAG) to answer questions about the PDF file or company using GPT. Users can interact with the application using a chat interface which is part of the Next.js frontend. Features include:

- **Authentication:** Users can register using email or Google account.
- **Multiple Chat instances:** A single user can have multiple chat instances on different reports/company names.
- **Chat History:** Each instance stores the chat history and can be utilized again as and when needed.
- **PDF Upload:** Users can upload PDF files related to a specific company.
- **Search:** Users can specify a compay name, for which a vectorestore knowledge base will be generated.
- **Vector Store Generation:** The application generates a vector store using LangChain, PineCone, and Huggingface embeddings.
- **Question Answering:** The application uses a Retrieval Augmented Generation (RAG) to answer questions about the PDF file or company using GPT.
- **Chat Interface:** Users can interact with the application using a chat interface.
- **Feedback:** Users can register their feedback by liking or disliking the LLM response using UI.

## Installation

- You will need API keys for PineCone and OpenAI

### Backend

1. Change directory to the "/backend"
```
cd .\backend\
```
2. Install the required dependencies: `pip install -r requirements.txt`
```
pip install -r requirements.txt
```  
3. Run the main.py file: `python main.py`
```
python main.py
```

### Frontend

- Change directory to the "/frontend/admonchat"
```
cd .\frontend\admonchat\
```
- Install the dependancies using 'npm install'
```
npm install
```
- Run the application with 'npm run dev'
```
npm run dev
```

- For production, the application has to be built with 'npm run build' and served with a server such as nginx.

  

## Usage  

1. Open the application in your browser.
2. Login/register using Google Account.
3. Upload a PDF file and enter a company name.
4. The application will generate a vector store and you can start asking questions about the PDF file or company.
5. Interact with the application using the chat interface.
<hr />

## Future Work:

 - Improve the search functionality. Utilise more APIs and web scraping to collected company search data.
 - Imrove the QA quality. One was for this can be by using Azure AI Search. This provides capacity to use skillsets like OCR reading in PDFs, multiple language support, automating indexing of data stored in blobs, etc.
 - Improve UI/UX.
 - Smart report generation from input data.

## Demo video:
- https://youtu.be/jSLtZxoT5BY

**Developed by:**  Ashish Kumar Jha
