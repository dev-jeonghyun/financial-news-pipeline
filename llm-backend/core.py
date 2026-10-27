from os import getenv
from dotenv import load_dotenv
load_dotenv()
api_key = getenv("OPENAI_API_KEY")
from langchain.chat_models import init_chat_model

# Load the environment variables from .env
base_url = getenv("OPENAI_BASE_URL")
model = init_chat_model("gpt-4o", model_provider="openai", base_url=base_url, api_key=api_key)
from typing import List

from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

class Sentiment(BaseModel):
    """Represents sentiment analysis results for a provided article."""
    summary: str = Field(..., descrption="Summary for news article")
    valence: int = Field(..., ge=1, le=5, description="Likert scale for valence in light of the topic to analysis. (1 to 5)")
    arousal: int = Field(..., ge=1, le=5, description="Likert scale for arousal in light of the topic to analysis. (1 to 5)")
    importance: int = Field(..., ge=1, le=10, description="""
Score for perceived short-term importance of the article in light of the topic to analysis. (1 to 10)

  1–3: 핵심 주제(예: S&P 500)에 거의 영향이 없는 일반 뉴스
  4–6: 주제와 관련은 있으나 단기적·간접적 영향에 그치는 내용
  7–8: 주제에 실질적이고 단기적인 영향이 기대되는 주요 사건
  9–10: 주제의 방향성을 완전히 바꿀 수 있는 중대 이벤트
Examples:
  - “한 기업의 소규모 정리해고”: 4
  - “연준의 기준금리 인상 발표”: 8
  - “대규모 금융위기 발발”: 10
""")

class AnalysisResult(BaseModel):
    results: List[Sentiment]

class Article(BaseModel):
    title: str
    article: str

class Articles(BaseModel):
    articles: List[Article]

parser = PydanticOutputParser(pydantic_object=Sentiment)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an expert in sentiment analysis. Your task is to evaluate the sentiment of an article.\n{format_instructions}",
        ),
        ("human", "topic to analysis: S&P 500"),
        ("human", "TITLE: 파월, 금리 동결 발표"),
        ("assistant", '"valence":3,"arousal":2,"importance":5'),
        ("human", "topic to analysis: S&P 500"),
        ("human", "TITLE: 연준 비정기 회의 예고"),
        ("assistant", '"valence":2,"arousal":4,"importance":8'),
        ("human", "topic to analysis: {subject}"),
        ("human", "TITLE: {title}\n{article}"),
    ]
).partial(format_instructions=parser.get_format_instructions())
chain = prompt | model | parser

def load_chain():
    return chain