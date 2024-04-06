from main import db, app

app.app_context().push()

# Drop all tables
db.drop_all()

# Recreate all tables
db.create_all()
