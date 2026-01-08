// Step indicator / progress bar component

"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import type { FormStep } from "@/types/employee"

interface StepIndicatorProps {
  steps: FormStep[]
  currentStep: number
  onStepClick?: (step: number) => void
  completedSteps?: number[]
}

export function StepIndicator({ steps, currentStep, onStepClick, completedSteps = [] }: StepIndicatorProps) {
  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = currentStep === step.id
          const isClickable = onStepClick && (isCompleted || step.id <= currentStep)

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn("flex flex-col items-center gap-2 group", isClickable && "cursor-pointer")}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.id}
                </div>
                <div className="text-center">
                  <p className={cn("text-sm font-medium", isCurrent ? "text-foreground" : "text-muted-foreground")}>
                    {step.title}
                  </p>
                </div>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn("flex-1 h-0.5 mx-4", completedSteps.includes(step.id) ? "bg-primary" : "bg-muted")}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm font-medium">{steps[currentStep - 1]?.title}</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
