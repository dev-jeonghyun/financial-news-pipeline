from sqlalchemy import Column, String, Text, Date
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker
from database import Base, SessionLocal

from newspaper import Article
from googlenewsdecoder import gnewsdecoder
import feedparser
import dateutil.parser
import time
import random
import requests
from datetime import datetime, timedelta
from tqdm import tqdm

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

class SeenLink(Base):
    __tablename__ = "seen_links"
    rss_url = Column(String, primary_key=True)

class StockIndex(Base):
    __tablename__ = "stock_index"
    Ticker = Column(String, primary_key=True)
    Name = Column(String)
    query = Column(String)

class StockBATMMAAN(Base):
    __tablename__ = "stock_batmmaan"
    Ticker = Column(String, primary_key=True)
    Name = Column(String)
    query = Column(String)

def load_ticker_queries():
    db = SessionLocal()
    queries = {}
    for item in db.query(StockIndex).all():
        if item.Ticker and item.query:
            queries[item.Ticker] = item.query
    for item in db.query(StockBATMMAAN).all():
        if item.Ticker and item.query:
            queries[item.Ticker] = item.query
    db.close()
    return queries

def rss_already_seen(db, rss_url):
    return db.query(SeenLink).filter_by(rss_url=rss_url).first() is not None

def save_seen_rss(db, rss_url):
    db.add(SeenLink(rss_url=rss_url))
    db.commit()

def real_url_already_saved(db, real_url):
    if not real_url:
        print("  real_url 비어있음 → 저장 시도")
        return False
    try:
        exists = db.query(NewsArticle).filter_by(real_url=real_url.strip()).first() is not None
        print(f"  DB 중복 확인: {'있음' if exists else '없음'} → {real_url}")
        return exists
    except Exception as e:
        db.rollback()
        print(f"  중복 확인 중 예외 발생: {e} → 저장 시도")
        return False

def call_llm_server(title: str, content: str, subject: str) -> dict:
    url = "http://llm:8000/analyze"
    payload = {
        "subject": subject,
        "articles": [{"title": title, "article": content}]
    }
    print(f"  LLM 요청 시작 (제목: {title[:40]}..., 길이: {len(content)}자)")
    try:
        response = requests.post(url, json=payload, timeout=300)
        response.raise_for_status()
        print("  LLM 응답 수신 → Summary OK")
        return response.json()["results"][0]
    except Exception as e:
        print(f"  LLM 호출 실패: {e}")
        return {"summary": None, "valence": None, "arousal": None, "importance": None}

def collect_news_for_ticker(ticker, query):
    db = SessionLocal()
    now = datetime.utcnow()
    start_time = (now - timedelta(days=2)).replace(hour=0, minute=0, second=0, microsecond=0)

    encoded_query = query.replace(" ", "+")
    rss_url = (
        f'https://news.google.com/rss/search?q={encoded_query}+after:{start_time.strftime("%Y-%m-%d")}'
        f'+before:{now.strftime("%Y-%m-%d")}&hl=en&gl=US&ceid=US:en'
    )

    print(f"\n[{ticker}] RSS 수집 시작 → {rss_url}")
    feed = feedparser.parse(rss_url)
    entries = feed.entries[:10]
    print(f"기사 수 : {len(entries)}")

    for idx, entry in enumerate(entries, 1):
        print(f"[{ticker}] 기사 {idx}: {entry.title[:60]}")
        rss_entry_url = entry.link

        if rss_already_seen(db, rss_entry_url):
            print("  이미 탐색한 RSS URL, 건너뜀")
            continue
        save_seen_rss(db, rss_entry_url)

        try:
            pubDate = dateutil.parser.parse(entry.published).replace(tzinfo=None)

            result = gnewsdecoder(rss_entry_url)
            time.sleep(random.uniform(1.5, 2.5))
            real_url = result.get("decoded_url")

            if not result.get("status") or not real_url or "news.google.com" in real_url:
                print("  → 디코딩 실패 또는 무효 링크")
                continue

            if real_url_already_saved(db, real_url):
                print("  → 이미 저장된 기사 URL, 건너뜀")
                continue

            article = Article(real_url)
            article.download()
            time.sleep(random.uniform(1.5, 2.5))
            article.parse()

            final_date = article.publish_date or pubDate
            today = datetime.utcnow().date()
            if abs((final_date.date() - today).days) > 2:
                print("  날짜 조건 불충분 → 저장 안함")
                continue

            if not article.text.strip() or not article.title.strip():
                print("  본문 또는 제목 없음 → 저장 안함")
                continue

            if len(article.text.strip()) < 300:
                print(f"  본문 길이 부족 ({len(article.text.strip())}자) → 저장 안함")
                continue

            llm_result = call_llm_server(article.title, article.text, f"{ticker} stock price")

            news_row = NewsArticle(
                id=f"{ticker}-{final_date.date()}-{hash(real_url)}",
                ticker=ticker,
                date=final_date.date(),
                title=article.title,
                article=article.text.strip(),
                real_url=real_url,
                rss_url=rss_entry_url,
                summary=llm_result["summary"],
                valence=llm_result["valence"],
                arousal=llm_result["arousal"],
                importance=llm_result["importance"]
            )
            db.add(news_row)
            db.commit()
            print(f"  DB 저장 성공 → {news_row.id}")

        except IntegrityError:
            db.rollback()
            print(f"  중복 건너뜀: {entry.title[:40]}...")
        except Exception as e:
            db.rollback()
            print(f"  예외 발생: {e}")

    db.close()

if __name__ == "__main__":
    while True:
        ticker_queries = load_ticker_queries()
        for ticker, query in ticker_queries.items():
            collect_news_for_ticker(ticker, query)
            time.sleep(random.uniform(3, 5))
        print("전체 종목 완료. 1시간 대기\n")
        time.sleep(3600)
