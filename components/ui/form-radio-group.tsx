// Reusable form radio group component

"use client"

import { forwardRef } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RadioOption {
  value: string
  label: string
}

interface FormRadioGroupProps {
  label: string
  error?: string
  required?: boolean
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
}

export const FormRadioGroup = forwardRef<HTMLDivElement, FormRadioGroupProps>(
  ({ label, error, required, options, value, onChange }, ref) => {
    const groupId = `radio-${label.toLowerCase().replace(/\s+/g, "-")}`

    return (
      <div className="space-y-3" ref={ref}>
        <Label className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        <RadioGroup value={value} onValueChange={onChange} className="flex flex-wrap gap-4" aria-labelledby={groupId}>
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={`${groupId}-${option.value}`} />
              <Label htmlFor={`${groupId}-${option.value}`} className="font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)

FormRadioGroup.displayName = "FormRadioGroup"
