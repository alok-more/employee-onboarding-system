// Reusable file upload component

"use client"

import { useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, FileText } from "lucide-react"

interface FileUploadProps {
  label: string
  error?: string
  required?: boolean
  accept?: string
  fileName?: string
  onFileSelect: (file: File | null) => void
}

export function FileUpload({
  label,
  error,
  required,
  accept = ".pdf,.jpg,.jpeg,.png",
  fileName,
  onFileSelect,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onFileSelect(file)
  }

  const handleRemove = () => {
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    onFileSelect(null)
  }

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" aria-label={label} />
      {fileName ? (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="flex-1 text-sm truncate">{fileName}</span>
          <Button type="button" variant="ghost" size="sm" onClick={handleRemove} aria-label="Remove file">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button type="button" variant="outline" className="w-full bg-transparent" onClick={handleClick}>
          <Upload className="h-4 w-4 mr-2" />
          Choose File (PDF/JPG)
        </Button>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
