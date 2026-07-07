from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class QueryRequest(BaseModel):
    query: str
    schema_key: Optional[str] = "college"
    dialect: Optional[str] = "mysql"

class TranslationResponse(BaseModel):
    sql: str
    explanation: str
    confidence: int
    schemaUsed: List[str]
    detectedSchema: str
    table: str
    optimization: str
    otherSuggestions: List[str]

class ExecuteRequest(BaseModel):
    sql: str
    schema_key: str

class ExecuteResponse(BaseModel):
    success: bool
    columns: List[str]
    rows: List[Dict[str, Any]]
    error: Optional[str] = None

class HistoryCreate(BaseModel):
    english_query: str
    sql_query: str
    schema_name: str
    dialect: str
    starred: Optional[bool] = False

class HistoryResponse(BaseModel):
    id: int
    english_query: str
    sql_query: str
    schema_name: str
    dialect: str
    timestamp: str
    starred: bool

    class Config:
        from_attributes = True
