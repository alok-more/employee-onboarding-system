// Main Employee Onboarding Wizard Component

"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  EmployeeFormData,
  PersonalDetails,
  EmploymentDetails,
  BankAndIdentity,
  EmergencyContacts,
} from "@/types/employee"
import { FORM_STEPS } from "@/lib/constants"
import {
  getInitialFormData,
  loadFormData,
  loadCurrentStep,
  saveFormData,
  clearFormData,
  submitEmployeeData,
  generateEmployeeId,
} from "@/lib/storage"
import { useFormPersistence } from "@/hooks/use-form-persistence"
import { StepIndicator } from "@/components/ui/step-indicator"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { PersonalDetailsForm } from "@/components/forms/personal-details-form"
import { EmploymentDetailsForm } from "@/components/forms/employment-details-form"
import { BankIdentityForm } from "@/components/forms/bank-identity-form"
import { EmergencyContactsForm } from "@/components/forms/emergency-contacts-form"
import { ReviewForm } from "@/components/forms/review-form"
import { SuccessScreen } from "@/components/forms/success-screen"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function EmployeeOnboardingWizard() {
  // Loading state for initial data fetch
  const [isLoading, setIsLoading] = useState(true)
  // Current step in the wizard
  const [currentStep, setCurrentStep] = useState(1)
  // Form data state
  const [formData, setFormData] = useState<EmployeeFormData>(getInitialFormData())
  // Track completed steps for navigation
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  // Track if form has unsaved changes
  const [isDirty, setIsDirty] = useState(false)
  // Success state after submission
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { toast } = useToast()

  // Form persistence hook
  useFormPersistence({ formData, currentStep, isDirty })

  // Load saved data on mount
  useEffect(() => {
    const savedData = loadFormData()
    const savedStep = loadCurrentStep()

    if (savedData) {
      setFormData(savedData)
      setCurrentStep(savedStep)
      // Mark all steps before current as completed
      setCompletedSteps(Array.from({ length: savedStep - 1 }, (_, i) => i + 1))
    }

    setIsLoading(false)
  }, [])

  // Update form data for a specific section
  const updateFormSection = useCallback(<T extends keyof EmployeeFormData>(section: T, data: EmployeeFormData[T]) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }))
    setIsDirty(true)
  }, [])

  // Handle next step
  const goToNextStep = useCallback(() => {
    setCompletedSteps((prev) => [...new Set([...prev, currentStep])])
    setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length))
  }, [currentStep])

  // Handle previous step
  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }, [])

  // Handle step navigation via indicator
  const goToStep = useCallback(
    (step: number) => {
      if (step <= currentStep || completedSteps.includes(step - 1)) {
        setCurrentStep(step)
      }
    },
    [currentStep, completedSteps],
  )

  // Handle save as draft
  const handleSaveDraft = useCallback(() => {
    saveFormData(formData)
    setIsDirty(false)
    toast({
      title: "Draft Saved",
      description: "Your progress has been saved.",
    })
  }, [formData, toast])

  // Handle reset form
  const handleResetForm = useCallback(() => {
    clearFormData()
    const newData = getInitialFormData()
    // Generate new employee ID
    newData.employmentDetails.employeeId = generateEmployeeId()
    setFormData(newData)
    setCurrentStep(1)
    setCompletedSteps([])
    setIsDirty(false)
    toast({
      title: "Form Reset",
      description: "All data has been cleared.",
    })
  }, [toast])

  // Handle final submission
  const handleSubmit = useCallback(async () => {
    const result = await submitEmployeeData(formData)
    if (result.success) {
      setIsSubmitted(true)
      setIsDirty(false)
      toast({
        title: "Success!",
        description: result.message,
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }, [formData, toast])

  // Handle starting new onboarding
  const handleStartNew = useCallback(() => {
    handleResetForm()
    setIsSubmitted(false)
  }, [handleResetForm])

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <SkeletonLoader type="form" lines={6} />
      </div>
    )
  }

  // Show success screen after submission
  if (isSubmitted) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <SuccessScreen employeeId={formData.employmentDetails.employeeId} onStartNew={handleStartNew} />
      </div>
    )
  }

  // Get current step info
  const currentStepInfo = FORM_STEPS[currentStep - 1]

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      {/* Header with Reset Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Employee Onboarding</h1>
          <p className="text-muted-foreground mt-1">Complete all steps to submit the form</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Form
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Form?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear all entered data and start fresh. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetForm}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <StepIndicator
          steps={FORM_STEPS}
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={goToStep}
        />
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            Step {currentStep}: {currentStepInfo.title}
          </CardTitle>
          <CardDescription>{currentStepInfo.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <PersonalDetailsForm
              data={formData.personalDetails}
              onSubmit={(data: PersonalDetails) => {
                updateFormSection("personalDetails", data)
                goToNextStep()
              }}
              onSaveDraft={handleSaveDraft}
            />
          )}

          {/* Step 2: Employment Details */}
          {currentStep === 2 && (
            <EmploymentDetailsForm
              data={formData.employmentDetails}
              onSubmit={(data: EmploymentDetails) => {
                updateFormSection("employmentDetails", data)
                goToNextStep()
              }}
              onBack={goToPreviousStep}
              onSaveDraft={handleSaveDraft}
            />
          )}

          {/* Step 3: Bank & Identity */}
          {currentStep === 3 && (
            <BankIdentityForm
              data={formData.bankAndIdentity}
              onSubmit={(data: BankAndIdentity) => {
                updateFormSection("bankAndIdentity", data)
                goToNextStep()
              }}
              onBack={goToPreviousStep}
              onSaveDraft={handleSaveDraft}
            />
          )}

          {/* Step 4: Emergency Contacts */}
          {currentStep === 4 && (
            <EmergencyContactsForm
              data={formData.emergencyContacts}
              onSubmit={(data: EmergencyContacts) => {
                updateFormSection("emergencyContacts", data)
                goToNextStep()
              }}
              onBack={goToPreviousStep}
              onSaveDraft={handleSaveDraft}
            />
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <ReviewForm data={formData} onSubmit={handleSubmit} onBack={goToPreviousStep} onEditSection={goToStep} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
