import uuid
from main import app, db, User, Chat, Message

app.app_context().push()

# Create users
user1 = User(id='gpt@openai.com', name='gpt')
user2 = User(id='chat.admon@gmail.com', name='Test User')
user3 = User(id='jha.ashish.in@gmail.com', name='Ashish')

# Create chats
# chat1 = Chat(user_id='chat.admon@gmail.com')
# chat2 = Chat(user_id='jha.ashish.in@gmail.com')
# chat4 = Chat(user_id='jha.ashish.in@gmail.com')
# chat5 = Chat(user_id='jha.ashish.in@gmail.com')

# # Create messages
message1 = Message(id=str(uuid.uuid4()), sender='jha.ashish.in@gmail.com', content='Hello!', chat_id='baf2a3a9-34e1-4a6c-9a2e-6d9425b589e9')
message2 = Message(id=str(uuid.uuid4()), sender='gpt@openai.com', content='How are you?', chat_id='baf2a3a9-34e1-4a6c-9a2e-6d9425b589e9')
message3 = Message(id=str(uuid.uuid4()), sender='jha.ashish.in@gmail.com', content='Hi John!', chat_id='baf2a3a9-34e1-4a6c-9a2e-6d9425b589e9')
message4 = Message(id=str(uuid.uuid4()), sender='gpt@openai.com', content='I\'m doing well, thank you!', chat_id='baf2a3a9-34e1-4a6c-9a2e-6d9425b589e9')
message5 = Message(id=str(uuid.uuid4()), sender='jha.ashish.in@gmail.com', content='That\'s great!', chat_id='baf2a3a9-34e1-4a6c-9a2e-6d9425b589e9')
message6 = Message(id=str(uuid.uuid4()), sender='gpt@openai.com', content='Hello!', chat_id='baf2a3a9-34e1-4a6c-9a2e-6d9425b589e9')
message7 = Message(id=str(uuid.uuid4()), sender='jha.ashish.in@gmail.com', content='Hi there!', chat_id='baf2a3a9-34e1-4a6c-9a2e-6d9425b589e9')

# Add to session and commit
# db.session.add(user1)
# db.session.add(user2)
# db.session.add(user3)
# db.session.add(chat4)
# db.session.add(chat5)
db.session.add(message1)
db.session.add(message2)
db.session.add(message3)
db.session.add(message4)
db.session.add(message5)
db.session.add(message6)
db.session.add(message7)
db.session.commit()
