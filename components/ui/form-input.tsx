// Reusable form input component with validation display

"use client"

import { forwardRef, type InputHTMLAttributes } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
  helpText?: string
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, helpText, className, id, ...props }, ref) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`

    return (
      <div className="space-y-2">
        <Label htmlFor={inputId} className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        <Input
          ref={ref}
          id={inputId}
          className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
          {...props}
        />
        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-sm text-muted-foreground">
            {helpText}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)

FormInput.displayName = "FormInput"
