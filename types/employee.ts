// TypeScript interfaces/types for all form data

// Step 1: Personal Details
export interface PersonalDetails {
  fullName: string
  email: string
  phoneNumber: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  maritalStatus: "single" | "married" | "divorced" | "widowed"
  spouseName?: string // Required if married
}

// Step 2: Employment Details
export interface EmploymentDetails {
  employeeId: string // Auto-generated, read-only
  department: string
  role: string
  employmentType: "full-time" | "contract"
  contractStartDate?: string // Required if contract
  contractEndDate?: string // Required if contract
}

// Step 3: Bank & Identity
export interface BankDetails {
  bankName: string
  accountNumber: string
  ifscCode: string
}

export interface IdentityProof {
  id: string // Unique ID for dynamic list management
  identityType: "aadhaar" | "passport" | "pan"
  identityNumber: string
  file?: File | null
  fileName?: string
}

export interface BankAndIdentity {
  bankDetails: BankDetails
  identityProofs: IdentityProof[]
}

// Step 4: Emergency Contacts
export interface EmergencyContact {
  id: string // Unique ID for dynamic list management
  contactName: string
  relationship: string
  phoneNumber: string
}

export interface EmergencyContacts {
  contacts: EmergencyContact[]
}

// Complete Employee Form Data
export interface EmployeeFormData {
  personalDetails: PersonalDetails
  employmentDetails: EmploymentDetails
  bankAndIdentity: BankAndIdentity
  emergencyContacts: EmergencyContacts
}

// Form step configuration
export interface FormStep {
  id: number
  title: string
  description: string
}

// Department and Role mapping
export interface DepartmentRoles {
  [department: string]: string[]
}
