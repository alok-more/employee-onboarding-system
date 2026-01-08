// Zod validation schemas for all form steps

import { z } from "zod"
import { VALIDATION_RULES } from "./constants"

// Helper function to calculate age from date of birth
const calculateAge = (dob: string): number => {
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Step 1: Personal Details Schema
export const personalDetailsSchema = z
  .object({
    fullName: z
      .string()
      .min(VALIDATION_RULES.minNameLength, `Name must be at least ${VALIDATION_RULES.minNameLength} characters`),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    dateOfBirth: z.string().refine(
      (dob) => {
        if (!dob) return false
        return calculateAge(dob) >= VALIDATION_RULES.minAge
      },
      { message: `You must be at least ${VALIDATION_RULES.minAge} years old` },
    ),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Please select a gender",
    }),
    maritalStatus: z.enum(["single", "married", "divorced", "widowed"], {
      required_error: "Please select marital status",
    }),
    spouseName: z.string().optional(),
  })
  .refine(
    (data) => {
      // If married, spouse name is required
      if (data.maritalStatus === "married") {
        return data.spouseName && data.spouseName.length >= VALIDATION_RULES.minNameLength
      }
      return true
    },
    {
      message: `Spouse name is required and must be at least ${VALIDATION_RULES.minNameLength} characters`,
      path: ["spouseName"],
    },
  )

// Step 2: Employment Details Schema
export const employmentDetailsSchema = z
  .object({
    employeeId: z.string(),
    department: z.string().min(1, "Please select a department"),
    role: z.string().min(1, "Please select a role"),
    employmentType: z.enum(["full-time", "contract"], {
      required_error: "Please select employment type",
    }),
    contractStartDate: z.string().optional(),
    contractEndDate: z.string().optional(),
  })
  .refine(
    (data) => {
      // If contract, start date is required
      if (data.employmentType === "contract") {
        return !!data.contractStartDate
      }
      return true
    },
    {
      message: "Contract start date is required",
      path: ["contractStartDate"],
    },
  )
  .refine(
    (data) => {
      // If contract, end date is required
      if (data.employmentType === "contract") {
        return !!data.contractEndDate
      }
      return true
    },
    {
      message: "Contract end date is required",
      path: ["contractEndDate"],
    },
  )
  .refine(
    (data) => {
      // End date must be after start date
      if (data.employmentType === "contract" && data.contractStartDate && data.contractEndDate) {
        return new Date(data.contractEndDate) > new Date(data.contractStartDate)
      }
      return true
    },
    {
      message: "Contract end date must be after start date",
      path: ["contractEndDate"],
    },
  )

// Step 3: Bank Details Schema
export const bankDetailsSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z
    .string()
    .regex(/^\d+$/, "Account number must contain only digits")
    .min(
      VALIDATION_RULES.minAccountNumberLength,
      `Account number must be at least ${VALIDATION_RULES.minAccountNumberLength} digits`,
    )
    .max(
      VALIDATION_RULES.maxAccountNumberLength,
      `Account number must not exceed ${VALIDATION_RULES.maxAccountNumberLength} digits`,
    ),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format (e.g., SBIN0001234)"),
})

// Identity Proof Schema
export const identityProofSchema = z.object({
  id: z.string(),
  identityType: z.enum(["aadhaar", "passport", "pan"], {
    required_error: "Please select identity type",
  }),
  identityNumber: z.string().min(1, "Identity number is required"),
  file: z.any().optional(),
  fileName: z.string().optional(),
})

// Step 3: Complete Bank & Identity Schema
export const bankAndIdentitySchema = z.object({
  bankDetails: bankDetailsSchema,
  identityProofs: z.array(identityProofSchema).min(1, "At least one identity proof is required"),
})

// Emergency Contact Schema
export const emergencyContactSchema = z.object({
  id: z.string(),
  contactName: z
    .string()
    .min(VALIDATION_RULES.minNameLength, `Name must be at least ${VALIDATION_RULES.minNameLength} characters`),
  relationship: z.string().min(1, "Please select a relationship"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
})

// Step 4: Emergency Contacts Schema
export const emergencyContactsSchema = z.object({
  contacts: z
    .array(emergencyContactSchema)
    .min(
      VALIDATION_RULES.minEmergencyContacts,
      `At least ${VALIDATION_RULES.minEmergencyContacts} emergency contact is required`,
    )
    .max(
      VALIDATION_RULES.maxEmergencyContacts,
      `Maximum ${VALIDATION_RULES.maxEmergencyContacts} emergency contacts allowed`,
    ),
})

// Complete form schema for review step
export const completeFormSchema = z.object({
  personalDetails: personalDetailsSchema,
  employmentDetails: employmentDetailsSchema,
  bankAndIdentity: bankAndIdentitySchema,
  emergencyContacts: emergencyContactsSchema,
})

// Type exports from schemas
export type PersonalDetailsInput = z.infer<typeof personalDetailsSchema>
export type EmploymentDetailsInput = z.infer<typeof employmentDetailsSchema>
export type BankAndIdentityInput = z.infer<typeof bankAndIdentitySchema>
export type EmergencyContactsInput = z.infer<typeof emergencyContactsSchema>
