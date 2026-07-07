from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import sqlite3

from database import get_db
import models
import schemas
import ai_service

app = FastAPI(title="AI SQL Query Generator API", version="1.0.0")

# CORS Configuration - enables secure cross-origin requests from our React App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/translate", response_model=schemas.TranslationResponse)
def translate(req: schemas.QueryRequest):
    try:
        result = ai_service.translate_query(req.query, req.schema_key, req.dialect)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/execute", response_model=schemas.ExecuteResponse)
def execute(req: schemas.ExecuteRequest):
    sql_to_run = req.sql.strip()
    
    if not sql_to_run:
        return schemas.ExecuteResponse(success=False, columns=[], rows=[], error="Query is empty.")

    try:
        conn = sqlite3.connect("sql_generator.db")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute(sql_to_run)
        
        if cursor.description:
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            
            result_rows = []
            for r in rows:
                row_dict = {}
                for col in columns:
                    val = r[col]
                    if isinstance(val, float) and col in ["total_amount", "revenue", "price"]:
                        row_dict[col] = f"${val:.2f}"
                    else:
                        row_dict[col] = val
                result_rows.append(row_dict)
                
            conn.close()
            return schemas.ExecuteResponse(success=True, columns=columns, rows=result_rows)
        else:
            conn.commit()
            affected = cursor.rowcount
            conn.close()
            return schemas.ExecuteResponse(
                success=True, 
                columns=["status"], 
                rows=[{"status": f"Command executed successfully. {affected} rows affected."}]
            )
    except Exception as e:
        return schemas.ExecuteResponse(success=False, columns=[], rows=[], error=str(e))

@app.get("/api/history", response_model=List[schemas.HistoryResponse])
def get_history(db: Session = Depends(get_db)):
    return db.query(models.QueryHistory).order_by(models.QueryHistory.id.desc()).all()

@app.post("/api/history", response_model=schemas.HistoryResponse)
def add_history(item: schemas.HistoryCreate, db: Session = Depends(get_db)):
    db_item = models.QueryHistory(
        english_query=item.english_query,
        sql_query=item.sql_query,
        schema_name=item.schema_name,
        dialect=item.dialect,
        starred=item.starred
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.post("/api/history/{item_id}/star", response_model=schemas.HistoryResponse)
def toggle_star_history(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.QueryHistory).filter(models.QueryHistory.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="History item not found")
    db_item.starred = not db_item.starred
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/history/{item_id}", status_code=204)
def delete_history_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.QueryHistory).filter(models.QueryHistory.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="History item not found")
    db.delete(db_item)
    db.commit()
    return

@app.delete("/api/history", status_code=204)
def clear_history(db: Session = Depends(get_db)):
    db.query(models.QueryHistory).delete()
    db.commit()
    return

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
