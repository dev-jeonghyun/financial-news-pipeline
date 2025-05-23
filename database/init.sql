-- 뉴스 기사를 저장하는 테이블
CREATE TABLE IF NOT EXISTS news_articles (
    id VARCHAR PRIMARY KEY,
    ticker VARCHAR NOT NULL,
    date DATE NOT NULL,
    title VARCHAR NOT NULL,
    article TEXT NOT NULL,
    real_url VARCHAR NOT NULL,
    rss_url VARCHAR NOT NULL,
    summary TEXT,
    valence VARCHAR,
    arousal VARCHAR,
    importance VARCHAR
);

-- 이미 확인한 RSS 링크를 저장하는 테이블
CREATE TABLE IF NOT EXISTS seen_links (
    rss_url VARCHAR PRIMARY KEY
);

-- 주식 인덱스 정보를 저장하는 테이블
CREATE TABLE IF NOT EXISTS stock_index (
    "Ticker" VARCHAR PRIMARY KEY,
    "Name" VARCHAR NOT NULL,
    query VARCHAR
);

-- BATMMAAN 주식 정보를 저장하는 테이블
CREATE TABLE IF NOT EXISTS stock_batmmaan (
    "Ticker" VARCHAR PRIMARY KEY,
    "Name" VARCHAR NOT NULL,
    query VARCHAR
);

-- 기본 주식 데이터 삽입
INSERT INTO stock_index ("Ticker", "Name", "query") VALUES
('SPY', 'SPDR S&P 500 ETF Trust', 'S&P 500 index stock market'),
('QQQ', 'Invesco QQQ Trust', 'NASDAQ-100 index stock market'),
('DIA', 'SPDR Dow Jones Industrial Average ETF', 'Dow Jones index stock market'),
('IWM', 'iShares Russell 2000 ETF', 'Russell 2000 index stock market')
ON CONFLICT ("Ticker") DO NOTHING;

-- BATMMAAN 주식 데이터 삽입
INSERT INTO stock_batmmaan ("Ticker", "Name", "query") VALUES
('AAPL', 'Apple Inc.', 'Apple stock market'),
('MSFT', 'Microsoft Corporation', 'Microsoft stock market'),
('GOOGL', 'Alphabet Inc.', 'Google stock market'),
('AMZN', 'Amazon.com, Inc.', 'Amazon stock market'),
('META', 'Meta Platforms, Inc.', 'Meta Facebook stock market'),
('TSLA', 'Tesla, Inc.', 'Tesla stock market'),
('NVDA', 'NVIDIA Corporation', 'NVIDIA stock market')
ON CONFLICT ("Ticker") DO NOTHING;

