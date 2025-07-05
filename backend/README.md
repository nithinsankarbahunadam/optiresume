# AI Resume Tailor Backend

FastAPI backend for the AI Resume Tailor application.

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Configure your environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `S3_BUCKET_NAME`: Your S3 bucket name

## Running the Server

```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

- `POST /api/analyze` - Analyze resume against job description
- `GET /api/download/{filename}` - Download tailored resume
- `GET /api/health` - Health check

## Features

- Resume parsing (PDF, DOC, DOCX)
- ATS scoring algorithm
- Keyword extraction and matching
- AI-powered resume optimization using Gemini
- S3 integration for file storage
- CORS enabled for frontend integration