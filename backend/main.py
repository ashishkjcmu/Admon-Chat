from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import uuid
import datetime
from flask_cors import CORS
import os
import PyPDF2

from langchain_community.vectorstores import Pinecone as PC
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, OnlinePDFLoader
from langchain_community.embeddings import HuggingFaceEmbeddings
from pinecone import Pinecone, ServerlessSpec
from langchain_openai import ChatOpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from operator import itemgetter
from langchain_community.utilities import WikipediaAPIWrapper

load_dotenv()

app = Flask(__name__)
CORS(app) 
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://avnadmin:AVNS_ziaPY9Lfd1awbRkjjJA@pdf-chat-pdf-chat.a.aivencloud.com:24598/pdfchat'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Initialize Pinecone
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index_name = "pdfchat"
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=768,
        metric='cosine',
        spec=ServerlessSpec(
            cloud='gcp',
            region='us-central1'
        )
    )
index = pc.Index(index_name)

wikipedia = WikipediaAPIWrapper()

embeddings = HuggingFaceEmbeddings(model_name='sentence-transformers/all-mpnet-base-v2')

# Initialize Langchain RAG pipeline
llm = ChatOpenAI(temperature=0, openai_api_key=os.environ['OPENAI_API_KEY'])
chain = load_qa_chain(llm, chain_type="stuff")

index_name = "pdfchat"  # put in the name of your pinecone index here
docsearch = {}
text_splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=100)

template = """
Answer the question based on the context below. If you can't 
answer the question, reply "I don't know".

Context: {context}

Question: {question}
"""

prompt = PromptTemplate.from_template(template)


class User(db.Model):
    """User model for storing user information."""

    id = db.Column(db.String(200), primary_key=True)
    name = db.Column(db.String(200), nullable=True)
    chats = db.relationship('Chat', backref='user', lazy=True)


class Chat(db.Model):
    """Chat model for storing chat information."""

    id = db.Column(db.String(200), primary_key=True, default=str(uuid.uuid4()))
    user_id = db.Column(db.String(200), db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False, default=f"Chat at {str(datetime.datetime.now())}")
    messages = db.relationship('Message', backref='chat', lazy=True)


class Message(db.Model):
    """Message model for storing message information."""

    id = db.Column(db.String(200), primary_key=True, default=str(uuid.uuid4()))
    chat_id = db.Column(db.String(200), db.ForeignKey('chat.id'), nullable=False)
    sender = db.Column(db.String(200), db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    score = db.Column(db.Integer, nullable=False, default=0)


@app.route('/')
def index():
    """Render the index.html template."""
    return render_template('index.html')


def get_response(msg, chat_id):
    """Get the response to a message in a chat.

    Args:
        msg (str): The message content.
        chat_id (str): The ID of the chat.

    Returns:
        str: The response to the message.
    """
    ds = PC.from_existing_index(index_name="pdfchat", embedding=embeddings, namespace=chat_id)
    retriever = ds.as_retriever()
    docr = ds.similarity_search(msg)
    chain = (
        {
            "context": itemgetter("question") | retriever,
            "question": itemgetter("question"),
        }
        | prompt
        | llm
    )
    gpt_response = chain.invoke({"question": msg})

    return gpt_response.content


@app.route('/message/<string:message_id>/like', methods=['POST'])
def like_message(message_id):
    """Like a message.

    Args:
        message_id (str): The ID of the message.

    Returns:
        str: JSON response indicating success or error.
    """
    try:
        msg = Message.query.get(message_id)
        if msg:
            msg.score = 1

            # Commit the changes to the database
            db.session.commit()
            return jsonify({"result": "success"}), 200
        else:
            return jsonify({"result": "error"}), 500
    except Exception as e:
        print(e)
        return jsonify({"result": "error"}), 500


@app.route('/message/<string:message_id>/dislike', methods=['POST'])
def dislike_message(message_id):
    """Dislike a message.

    Args:
        message_id (str): The ID of the message.

    Returns:
        str: JSON response indicating success or error.
    """
    try:
        msg = Message.query.get(message_id)
        if msg:
            msg.score = -1

            # Commit the changes to the database
            db.session.commit()
            return jsonify({"result": "success"}), 200
        else:
            print("Message not found")
            return jsonify({"result": "error"}), 500
    except Exception as e:
        print(e)
        return jsonify({"result": "error"}), 500


@app.route('/chats/<string:chat_id>/send_message', methods=['POST'])
def send_message(chat_id):
    """Send a message in a chat.

    Args:
        chat_id (str): The ID of the chat.

    Returns:
        str: JSON response containing the message information.
    """
    try:
        sender = request.form['sender']
        content = request.form['content']
        message_id = uuid.uuid4()
        new_message = Message(id=str(message_id), sender=sender, content=content, chat_id=chat_id)
        db.session.add(new_message)
        db.session.commit()
        answer = get_response(content, chat_id)
        answer_id = uuid.uuid4()
        new_answer = Message(id=str(answer_id), sender="gpt@openai.com", content=answer, chat_id=chat_id)
        db.session.add(new_answer)
        db.session.commit()

        fr = {
            "message_id": message_id,
            "id": str(answer_id),
            "sender": "gpt@openai.com",
            "content": answer,
            "chat_id": chat_id
        }
        return jsonify(fr)
    except Exception as e:
        return jsonify({'answer': f"Error: {e}"}), 500


@app.route('/user/<string:user_id>/chats')
def get_user_chats(user_id):
    """Get the chats of a user.

    Args:
        user_id (str): The ID of the user.

    Returns:
        str: JSON response containing the chat information.
    """
    user = User.query.get(user_id)
    if user:
        chats = [{'id': chat.id, 'title': chat.title} for chat in user.chats]
        return jsonify(chats)
    else:
        chats = []
        return jsonify(chats)



@app.route('/chat/<string:chat_id>/messages')
def get_chat_messages(chat_id):
    """Get the messages of a chat.

    Args:
        chat_id (str): The ID of the chat.

    Returns:
        str: JSON response containing the message information.
    """
    chat = Chat.query.get(chat_id)
    if chat:
        messages = [{'id': message.id, 'chat_id': message.chat_id, 'sender': message.sender, 'content': message.content, 'score': message.score} for message in chat.messages]
        return jsonify(messages)
    else:
        messages = []
        return jsonify(messages)



@app.route('/company/<string:user_id>/submit', methods=['POST'])
def submit_company(user_id):
    """Submit a company for research.

    Args:
        user_id (str): The ID of the user.

    Returns:
        str: JSON response containing the chat information.
    """
    user = User.query.get(user_id)
    if user:
        pass
    else:
        new_user = User(id=user_id, name='System User')
        db.session.add(new_user)
        db.session.commit()

    chat_id = uuid.uuid4()
    welcome_message = "Your company has been researched. You can now ask questions about the company."
    company_name = request.form.get('company')
    company_data = wikipedia.run(company_name)
    docs = text_splitter.split_text(company_data)
    docsearch = PC.from_texts([t for t in docs], embeddings, index_name="pdfchat", namespace=str(chat_id))
    new_chat = Chat(id=str(chat_id), user_id=user_id, title=f"{company_name} at {str(datetime.datetime.now())}")
    new_message = Message(id=str(uuid.uuid4()), sender='gpt@openai.com', content=welcome_message, chat_id=str(chat_id))
    db.session.add(new_chat)
    db.session.add(new_message)
    db.session.commit()
    return jsonify({'chat_id': chat_id, 'title': f"{company_name} at {str(datetime.datetime.now())}"}), 200


@app.route('/<string:user_id>/upload', methods=['POST'])
def upload_file(user_id):
    """Upload a file and process it.

    Args:
        user_id (str): The ID of the user.

    Returns:
        str: JSON response containing the chat information.
    """
    global docsearch

    user = User.query.get(user_id)
    if user:
        pass
    else:
        new_user = User(id=user_id, name='System User')
        db.session.add(new_user)
        db.session.commit()

    welcome_message = "Your file has been successfully uploaded and processed. You can now start chatting with your document."
    if 'file' not in request.files:
        return 'No file part in the request', 400

    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    if file:
        chat_id = uuid.uuid4()
        filepath = os.path.join(os.getcwd(), f'datafiles/{chat_id}.pdf')
        file.save(filepath)
        loader = PyPDFLoader(filepath)
        data = loader.load()
        docs = text_splitter.split_documents(data)
        docsearch = PC.from_texts([t.page_content for t in docs], embeddings, index_name="pdfchat", namespace=str(chat_id))
        new_chat = Chat(id=str(chat_id), user_id=user_id, title=f"{str(file.filename)} at {str(datetime.datetime.now())}")
        new_message = Message(id=str(uuid.uuid4()), sender='gpt@openai.com', content=welcome_message, chat_id=str(chat_id))
        db.session.add(new_chat)
        db.session.add(new_message)
        db.session.commit()
        return jsonify({'chat_id': chat_id, 'title': f"{str(file.filename)} at {str(datetime.datetime.now())}"}), 200

    return 'Something went wrong', 500


if __name__ == '__main__':
    app.run(debug=True)

