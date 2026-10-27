from pathlib import Path
from typing import Annotated, List

from pydantic import BaseModel, Field
from fastapi import Body, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core import load_chain, AnalysisResult, Article

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chain = load_chain()

@app.get("/health")
async def check_health():
    return {"status": "ok"}


@app.post("/analyze")
async def run_query(
    articles: Annotated[List[Article], Body(...)],
    subject: Annotated[str, Body(...)]
) -> AnalysisResult:
    results = []
    for article in articles:
        results.append(chain.invoke(article.dict() | {"subject": subject}))
    
    return {
        "results": results
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}