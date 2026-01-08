// Step 1: Personal Details Form

"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import type { PersonalDetails } from "@/types/employee"
import { personalDetailsSchema, type PersonalDetailsInput } from "@/lib/validation-schemas"
import { GENDER_OPTIONS, MARITAL_STATUS_OPTIONS } from "@/lib/constants"
import { FormInput } from "@/components/ui/form-input"
import { FormSelect } from "@/components/ui/form-select"
import { FormRadioGroup } from "@/components/ui/form-radio-group"
import { Button } from "@/components/ui/button"

interface PersonalDetailsFormProps {
  data: PersonalDetails
  onSubmit: (data: PersonalDetails) => void
  onSaveDraft: () => void
}

export function PersonalDetailsForm({ data, onSubmit, onSaveDraft }: PersonalDetailsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonalDetailsInput>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: data,
  })

  // Watch marital status for conditional field
  const maritalStatus = watch("maritalStatus")

  // Scroll to first error
  useEffect(() => {
    const firstError = Object.keys(errors)[0]
    if (firstError) {
      const element = document.querySelector(`[name="${firstError}"]`)
      element?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [errors])

  const handleFormSubmit = (formData: PersonalDetailsInput) => {
    onSubmit(formData as PersonalDetails)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Full Name */}
        <FormInput
          label="Full Name"
          required
          error={errors.fullName?.message}
          {...register("fullName")}
          placeholder="Enter your full name"
        />

        {/* Email */}
        <FormInput
          label="Email Address"
          type="email"
          required
          error={errors.email?.message}
          {...register("email")}
          placeholder="name@example.com"
        />

        {/* Phone Number */}
        <FormInput
          label="Phone Number"
          type="tel"
          required
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
          placeholder="10 digit phone number"
          helpText="Enter 10 digit phone number without spaces"
        />

        {/* Date of Birth */}
        <FormInput
          label="Date of Birth"
          type="date"
          required
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
          helpText="You must be at least 18 years old"
        />

        {/* Gender */}
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <FormRadioGroup
              label="Gender"
              required
              options={GENDER_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.gender?.message}
            />
          )}
        />

        {/* Marital Status */}
        <Controller
          name="maritalStatus"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Marital Status"
              required
              options={MARITAL_STATUS_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.maritalStatus?.message}
            />
          )}
        />

        {/* Spouse Name - Conditional */}
        {maritalStatus === "married" && (
          <FormInput
            label="Spouse Name"
            required
            error={errors.spouseName?.message}
            {...register("spouseName")}
            placeholder="Enter spouse's full name"
          />
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onSaveDraft}>
          Save as Draft
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Validating..." : "Next Step"}
        </Button>
      </div>
    </form>
  )
}
