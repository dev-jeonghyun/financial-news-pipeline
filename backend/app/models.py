from sqlalchemy import Text, Date, Column, String, Table, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

user_index_interest = Table(
    'user_index_interest',
    Base.metadata,
    Column('user_id', String, ForeignKey('users.id'), primary_key=True),
    Column('ticker', String, ForeignKey('stock_index.Ticker'), primary_key=True)
)

user_stock_interest = Table(
    'user_stock_interest',
    Base.metadata,
    Column('user_id', String, ForeignKey('users.id'), primary_key=True),
    Column('ticker', String, ForeignKey('stock_batmmaan.Ticker'), primary_key=True)
)

class User(Base):
    __tablename__ = 'users'

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    provider = Column(String)

    interested_indices = relationship("StockIndex", secondary=user_index_interest, backref="interested_users")
    interested_stocks = relationship("StockBATMMAAN", secondary=user_stock_interest, backref="interested_users")

class StockIndex(Base):
    __tablename__ = 'stock_index'

    Ticker = Column(String, primary_key=True)
    Name = Column(String)
    query = Column(String)

class StockBATMMAAN(Base):
    __tablename__ = 'stock_batmmaan'

    Ticker = Column(String, primary_key=True)
    Name = Column(String)
    query = Column(String)

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(String, primary_key=True)
    ticker = Column(String)
    date = Column(Date)
    title = Column(String)
    article = Column(Text)
    real_url = Column(String)
    rss_url = Column(String)
    summary = Column(Text, nullable=True)
    valence = Column(String, nullable=True)
    arousal = Column(String, nullable=True)
    importance = Column(String, nullable=True)

    __table_args__ = (
        UniqueConstraint("real_url", "title", name="uq_realurl_title"),
    )

class SeenLink(Base):
    __tablename__ = "seen_links"

    rss_url = Column(String, primary_key=True)