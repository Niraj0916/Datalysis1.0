from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Customer Insight Dashboard API"}

# [NEW] File Upload Endpoint
from fastapi import File, UploadFile, HTTPException
from analysis import process_data, calculate_kpis, generate_insights, generate_trends
import io
import pandas as pd

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV.")
    
    try:
        # Read file content
        content = await file.read()
        
        # Process data
        # We need to pass a file-like object to pandas
        df, quality_score = process_data(io.BytesIO(content))
        
        if df.empty:
             raise HTTPException(status_code=400, detail="Could not process data. File might be empty or malformed.")
             
        # Generate Analysis
        kpis = calculate_kpis(df)
        insights = generate_insights(df, kpis)
        trends = generate_trends(df)
        
        return {
            "status": "success",
            "filename": file.filename,
            "data_quality_score": quality_score,
            "kpis": kpis,
            "insights": insights,
            "trends": trends
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
