from sqlalchemy import Column, Integer, String, Boolean
from datetime import datetime
from database import Base

class QueryHistory(Base):
  __tablename__ = "query_history"

  id = Column(Integer, primary_key=True, index=True)
  english_query = Column(String, nullable=False)
  sql_query = Column(String, nullable=False)
  schema_name = Column(String, nullable=False)
  dialect = Column(String, nullable=False)
  timestamp = Column(String, default=lambda: datetime.now().strftime("%I:%M %p"))
  starred = Column(Boolean, default=False)
