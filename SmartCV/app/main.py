from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from app.analyzer import analyze_cv

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    result = analyze_cv(file)
    return result
