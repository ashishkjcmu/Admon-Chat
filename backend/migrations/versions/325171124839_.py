"""empty message

Revision ID: 325171124839
Revises: 
Create Date: 2024-04-03 23:29:27.284611

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '325171124839'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.String(length=200), nullable=False),
    sa.Column('name', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('chat',
    sa.Column('id', sa.String(length=200), nullable=False),
    sa.Column('user_id', sa.String(length=200), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('message',
    sa.Column('id', sa.String(length=200), nullable=False),
    sa.Column('chat_id', sa.String(length=200), nullable=False),
    sa.Column('sender', sa.String(length=200), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('score', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['chat_id'], ['chat.id'], ),
    sa.ForeignKeyConstraint(['sender'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('message')
    op.drop_table('chat')
    op.drop_table('user')
    # ### end Alembic commands ###