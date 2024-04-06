# PDF Chat
### Next.js Application with PDF Upload and Question Answering based on RAG (Retrieval Augmented Generation)

This is a Next.js application that allows users to upload PDF files and enter a company name. The backend then generates a vector store using LangChain, PineCone, and Huggingface embeddings. These are used in a Retrieval Augmented Generation (RAG) to answer questions about the PDF file or company using GPT. Users can interact with the application using a chat interface which is part of the Next.js frontend.

## Features

- PDF Upload: Users can upload PDF files related to a specific company.
- Search: Users can specify a compay name, for which a vectorestore knowledge base will be generated.
- Vector Store Generation: The application generates a vector store using LangChain, PineCone, and Huggingface embeddings.
- Question Answering: The application uses a Retrieval Augmented Generation (RAG) to answer questions about the PDF file or company using GPT.
- Chat Interface: Users can interact with the application using a chat interface.
- Feedback: Users can register their feedback by liking or disliking the LLM response using UI.

## Installation
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