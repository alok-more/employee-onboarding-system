// LocalStorage helper functions for form persistence

import type { EmployeeFormData } from "@/types/employee"

const STORAGE_KEY = "employee_onboarding_form"
const CURRENT_STEP_KEY = "employee_onboarding_step"
const SUBMITTED_DATA_KEY = "employee_submitted_data"

// Generate unique employee ID
export const generateEmployeeId = (): string => {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 7)
  return `EMP-${timestamp}-${randomStr}`.toUpperCase()
}

// Generate unique ID for dynamic list items
export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Get initial form data with defaults
export const getInitialFormData = (): EmployeeFormData => ({
  personalDetails: {
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "male",
    maritalStatus: "single",
    spouseName: "",
  },
  employmentDetails: {
    employeeId: generateEmployeeId(),
    department: "",
    role: "",
    employmentType: "full-time",
    contractStartDate: "",
    contractEndDate: "",
  },
  bankAndIdentity: {
    bankDetails: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
    },
    identityProofs: [
      {
        id: generateUniqueId(),
        identityType: "aadhaar",
        identityNumber: "",
        file: null,
        fileName: "",
      },
    ],
  },
  emergencyContacts: {
    contacts: [
      {
        id: generateUniqueId(),
        contactName: "",
        relationship: "",
        phoneNumber: "",
      },
    ],
  },
})

// Save form data to localStorage
export const saveFormData = (data: EmployeeFormData): void => {
  try {
    // We can't serialize File objects, so we store file names only
    const serializableData = {
      ...data,
      bankAndIdentity: {
        ...data.bankAndIdentity,
        identityProofs: data.bankAndIdentity.identityProofs.map((proof) => ({
          ...proof,
          file: null,
          fileName: proof.fileName || "",
        })),
      },
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableData))
  } catch (error) {
    console.error("Error saving form data:", error)
  }
}

// Load form data from localStorage
export const loadFormData = (): EmployeeFormData | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
    return null
  } catch (error) {
    console.error("Error loading form data:", error)
    return null
  }
}

// Clear form data from localStorage
export const clearFormData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(CURRENT_STEP_KEY)
  } catch (error) {
    console.error("Error clearing form data:", error)
  }
}

// Save current step
export const saveCurrentStep = (step: number): void => {
  try {
    localStorage.setItem(CURRENT_STEP_KEY, step.toString())
  } catch (error) {
    console.error("Error saving current step:", error)
  }
}

// Load current step
export const loadCurrentStep = (): number => {
  try {
    const saved = localStorage.getItem(CURRENT_STEP_KEY)
    return saved ? Number.parseInt(saved, 10) : 1
  } catch (error) {
    console.error("Error loading current step:", error)
    return 1
  }
}

// Save submitted employee data (mock API)
export const submitEmployeeData = async (data: EmployeeFormData): Promise<{ success: boolean; message: string }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    // Get existing submissions
    const existingData = localStorage.getItem(SUBMITTED_DATA_KEY)
    const submissions: EmployeeFormData[] = existingData ? JSON.parse(existingData) : []

    // Add new submission
    submissions.push(data)
    localStorage.setItem(SUBMITTED_DATA_KEY, JSON.stringify(submissions))

    // Clear draft data
    clearFormData()

    return { success: true, message: "Employee data submitted successfully!" }
  } catch (error) {
    console.error("Error submitting data:", error)
    return { success: false, message: "Failed to submit data. Please try again." }
  }
}

// Get all submitted employees
export const getSubmittedEmployees = (): EmployeeFormData[] => {
  try {
    const data = localStorage.getItem(SUBMITTED_DATA_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error getting submitted employees:", error)
    return []
  }
}
