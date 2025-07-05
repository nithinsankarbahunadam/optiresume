export interface AnalysisResult {
  ats_score: number
  keyword_matches: number
  total_keywords: number
  missing_keywords: string[]
  suggestions: string[]
  tailored_resume_url: string
  original_filename: string
}

export interface FileUploadProps {
  file: File | null
  onFileSelect: (file: File | null) => void
}

export interface JobDescriptionProps {
  value: string
  onChange: (value: string) => void
}