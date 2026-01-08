// Reusable form select component with validation display

"use client"

import { forwardRef } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  label: string
  error?: string
  required?: boolean
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
  ({ label, error, required, options, value, onChange, placeholder, disabled, className }, ref) => {
    const selectId = `select-${label.toLowerCase().replace(/\s+/g, "-")}`

    return (
      <div className="space-y-2">
        <Label htmlFor={selectId} className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            ref={ref}
            id={selectId}
            className={cn(error && "border-destructive focus:ring-destructive", className)}
            aria-invalid={!!error}
          >
            <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)

FormSelect.displayName = "FormSelect"
