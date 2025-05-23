from pydantic import BaseModel
from datetime import date
from typing import Optional

class NewsResponse(BaseModel):
    id: str
    ticker: str
    date: date
    title: str
    article: str
    real_url: str
    rss_url: str
    summary: Optional[str]
    valence: Optional[str]
    arousal: Optional[str]
    importance: Optional[str]

    model_config = {
        "from_attributes": True
    }
