# 금융 뉴스 비동기 데이터 파이프라인 및 LLM 시스템

실시간 금융 뉴스 데이터를 수집하고, 비동기 파이프라인과 LLM을 연동하여 분석 및 제공하는 멀티 모듈 기반 웹 서비스입니다.

## 주요 기능 및 아키텍처

- FastAPI 기반 백엔드 아키텍처: RESTful API 설계 및 SQLAlchemy를 활용한 PostgreSQL 데이터베이스 연동
- 비동기 웹 크롤러 파이프라인: `Asyncio` 기반의 효율적인 대량 금융 뉴스 데이터 수집 및 최적화
- LLM 감성 분석 시스템: OpenAI API 연동 및 프롬프트 엔지니어링을 통한 실시간 뉴스 내용 분석 자동화
- Docker Compose 통합 배포: Frontend, FastAPI, LLM Backend, Crawler, PostgreSQL DB를 멀티 모듈 컨테이너 환경으로 오케스트레이션

## Tech Stack

- Backend / API: Python, FastAPI, SQLAlchemy, PostgreSQL, Pydantic
- Pipeline & Crawler: Asyncio, BeautifulSoup
- AI / LLM: OpenAI API, Prompt Engineering
- Frontend: Vite, React, TypeScript, Tailwind CSS
- Infrastructure & DevOps: Docker, Docker Compose, Git / GitHub
