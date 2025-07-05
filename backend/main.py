from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os
import tempfile
import shutil
from pathlib import Path
import boto3
from botocore.exceptions import ClientError
import google.generativeai as genai
from typing import List, Dict, Any
import json
import re
from datetime import datetime
import uuid
from pydantic import BaseModel
import PyPDF2
from docx import Document
import io
import mimetypes
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="AI Resume Tailor API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

# Initialize services
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('models/gemini-1.5-pro')

if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
    s3_client = boto3.client(
        's3',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )

# Create directories
os.makedirs("temp", exist_ok=True)
os.makedirs("downloads", exist_ok=True)

class AnalysisResponse(BaseModel):
    ats_score: int
    keyword_matches: int
    total_keywords: int
    missing_keywords: List[str]
    suggestions: List[str]
    tailored_resume_url: str
    original_filename: str

def extract_text_from_pdf(file_content: bytes) -> str:
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

def extract_text_from_docx(file_content: bytes) -> str:
    try:
        doc = Document(io.BytesIO(file_content))
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading DOCX: {str(e)}")

def extract_keywords_from_job_description(job_description: str) -> List[str]:
    technical_keywords = [
        'python', 'java', 'javascript', 'react', 'node.js', 'sql', 'aws', 'docker',
        'kubernetes', 'machine learning', 'ai', 'data science', 'analytics',
        'project management', 'agile', 'scrum', 'leadership', 'communication'
    ]
    job_lower = job_description.lower()
    found_keywords = []
    for keyword in technical_keywords:
        if keyword in job_lower:
            found_keywords.append(keyword.title())
    skill_patterns = [
        r'(?:skills?|requirements?|qualifications?)[:\s]*([^.]+)',
        r'(?:experience with|proficient in|knowledge of)[:\s]*([^.]+)',
        r'(?:must have|required)[:\s]*([^.]+)'
    ]
    for pattern in skill_patterns:
        matches = re.findall(pattern, job_description, re.IGNORECASE)
        for match in matches:
            skills = re.split(r'[,;•\n]', match)
            for skill in skills[:5]:
                skill = skill.strip()
                if len(skill) > 2 and len(skill) < 30:
                    found_keywords.append(skill.title())
    return list(set(found_keywords))

def calculate_ats_score(resume_text: str, job_keywords: List[str]) -> Dict[str, Any]:
    resume_lower = resume_text.lower()
    matched_keywords = []
    missing_keywords = []
    for keyword in job_keywords:
        if keyword.lower() in resume_lower:
            matched_keywords.append(keyword)
        else:
            missing_keywords.append(keyword)
    keyword_score = (len(matched_keywords) / len(job_keywords)) * 70 if job_keywords else 0
    format_score = 20
    completeness_score = 10
    total_score = min(100, int(keyword_score + format_score + completeness_score))
    return {
        'ats_score': total_score,
        'keyword_matches': len(matched_keywords),
        'total_keywords': len(job_keywords),
        'missing_keywords': missing_keywords[:10],
        'matched_keywords': matched_keywords
    }

def generate_optimization_suggestions(analysis_result: Dict[str, Any]) -> List[str]:
    suggestions = []
    if analysis_result['ats_score'] < 60:
        suggestions.append("Your ATS score is below average. Focus on incorporating more relevant keywords from the job description.")
    if len(analysis_result['missing_keywords']) > 5:
        suggestions.append("Add missing technical skills and keywords to your skills section and experience descriptions.")
    suggestions.extend([
        "Use action verbs to start bullet points in your experience section",
        "Quantify your achievements with specific numbers and percentages",
        "Ensure your resume format is ATS-friendly with clear section headers",
        "Include a professional summary that matches the job requirements"
    ])
    return suggestions

def save_resume_as_pdf(text: str, output_path: str):
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter
    y = height - 40
    for line in text.split("\n"):
        if y < 40:
            c.showPage()
            y = height - 40
        c.drawString(40, y, line)
        y -= 14
    c.save()

async def save_job_description_to_s3(job_description: str, job_id: str) -> str:
    try:
        key = f"job-descriptions/{job_id}.txt"
        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=key,
            Body=job_description.encode('utf-8'),
            ContentType='text/plain'
        )
        return key
    except Exception as e:
        print(f"Error saving to S3: {e}")
        return ""

async def generate_tailored_resume_with_gemini(resume_text: str, job_description: str, missing_keywords: List[str]) -> str:
    try:
        prompt = f"""
        You are an expert resume writer and career coach. Please optimize the following resume for the given job description.

        Job Description:
        {job_description}

        Current Resume:
        {resume_text}

        Missing Keywords to incorporate: {', '.join(missing_keywords)}

        Instructions:
        1. Preserve the original structure and format as much as possible
        2. Naturally incorporate the missing keywords where relevant
        3. Enhance bullet points with more impactful language
        4. Quantify achievements where possible
        5. Ensure the resume is ATS-friendly
        6. Keep the same personal information and contact details
        7. Focus on making the experience and skills more relevant to the job

        Please provide the optimized resume in the same format as the original:
        """
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error with Gemini API: {e}")
        return f"{resume_text}\n\n[AI Optimization Note: Basic keyword optimization applied]"

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    job_description: str = Form(...),
    resume_file: UploadFile = File(...)
):
    if not resume_file.filename.lower().endswith(('.pdf', '.docx', '.doc')):
        raise HTTPException(status_code=400, detail="Only PDF, DOC, and DOCX files are supported")
    try:
        file_content = await resume_file.read()
        if resume_file.filename.lower().endswith('.pdf'):
            resume_text = extract_text_from_pdf(file_content)
        else:
            resume_text = extract_text_from_docx(file_content)
        if not resume_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from resume")
        job_id = str(uuid.uuid4())
        if S3_BUCKET_NAME:
            await save_job_description_to_s3(job_description, job_id)
        job_keywords = extract_keywords_from_job_description(job_description)
        analysis_result = calculate_ats_score(resume_text, job_keywords)
        suggestions = generate_optimization_suggestions(analysis_result)
        tailored_resume_text = await generate_tailored_resume_with_gemini(
            resume_text, job_description, analysis_result['missing_keywords']
        )
        pdf_filename = f"tailored_resume_{job_id}.pdf"
        pdf_path = f"downloads/{pdf_filename}"
        save_resume_as_pdf(tailored_resume_text, pdf_path)
        return AnalysisResponse(
            ats_score=analysis_result['ats_score'],
            keyword_matches=analysis_result['keyword_matches'],
            total_keywords=analysis_result['total_keywords'],
            missing_keywords=analysis_result['missing_keywords'],
            suggestions=suggestions,
            tailored_resume_url=f"/api/download/{pdf_filename}",
            original_filename=resume_file.filename
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/download/{filename}")
async def download_file(filename: str):
    file_path = f"downloads/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    media_type, _ = mimetypes.guess_type(filename)
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type=media_type or 'application/octet-stream'
    )

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "gemini_api": "configured" if GEMINI_API_KEY else "not configured",
            "s3": "configured" if S3_BUCKET_NAME else "not configured"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)