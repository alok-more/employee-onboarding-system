// Constants for form options and configurations

import type { DepartmentRoles, FormStep } from "@/types/employee"

// Form steps configuration
export const FORM_STEPS: FormStep[] = [
  { id: 1, title: "Personal Details", description: "Basic personal information" },
  { id: 2, title: "Employment Details", description: "Job and department info" },
  { id: 3, title: "Bank & Identity", description: "Financial and ID proofs" },
  { id: 4, title: "Emergency Contacts", description: "Emergency contact persons" },
  { id: 5, title: "Review & Submit", description: "Review and confirm" },
]

// Gender options
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
]

// Marital status options
export const MARITAL_STATUS_OPTIONS = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
]

// Department options with dependent roles
export const DEPARTMENT_ROLES: DepartmentRoles = {
  Engineering: ["Software Engineer", "Senior Engineer", "Tech Lead", "Engineering Manager"],
  "Human Resources": ["HR Executive", "HR Manager", "Recruiter", "HR Business Partner"],
  Finance: ["Accountant", "Financial Analyst", "Finance Manager", "CFO"],
  Marketing: ["Marketing Executive", "Content Writer", "SEO Specialist", "Marketing Manager"],
  Sales: ["Sales Executive", "Account Manager", "Sales Manager", "VP Sales"],
  Operations: ["Operations Executive", "Operations Manager", "COO", "Process Analyst"],
}

export const DEPARTMENTS = Object.keys(DEPARTMENT_ROLES)

// Employment type options
export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "full-time", label: "Full-Time" },
  { value: "contract", label: "Contract" },
]

// Identity type options
export const IDENTITY_TYPE_OPTIONS = [
  { value: "aadhaar", label: "Aadhaar Card" },
  { value: "passport", label: "Passport" },
  { value: "pan", label: "PAN Card" },
]

// Relationship options for emergency contacts
export const RELATIONSHIP_OPTIONS = ["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"]

// Validation constants
export const VALIDATION_RULES = {
  minNameLength: 3,
  phoneNumberLength: 10,
  minAge: 18,
  minAccountNumberLength: 9,
  maxAccountNumberLength: 18,
  minEmergencyContacts: 1,
  maxEmergencyContacts: 3,
}
