"use client"

// Custom hook for form persistence and unsaved changes warning

import { useEffect, useCallback, useRef } from "react"
import type { EmployeeFormData } from "@/types/employee"
import { saveFormData, saveCurrentStep } from "@/lib/storage"

interface UseFormPersistenceProps {
  formData: EmployeeFormData
  currentStep: number
  isDirty: boolean
}

export function useFormPersistence({ formData, currentStep, isDirty }: UseFormPersistenceProps) {
  const isInitialMount = useRef(true)

  // Save form data whenever it changes
  useEffect(() => {
    // Skip saving on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    // Debounce saving
    const timeoutId = setTimeout(() => {
      saveFormData(formData)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formData])

  // Save current step
  useEffect(() => {
    saveCurrentStep(currentStep)
  }, [currentStep])

  // Warn user of unsaved changes before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ""
        return ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isDirty])

  // Manual save function
  const manualSave = useCallback(() => {
    saveFormData(formData)
    saveCurrentStep(currentStep)
  }, [formData, currentStep])

  return { manualSave }
}
