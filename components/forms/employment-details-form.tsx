// Step 2: Employment Details Form

"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import type { EmploymentDetails } from "@/types/employee"
import { employmentDetailsSchema, type EmploymentDetailsInput } from "@/lib/validation-schemas"
import { DEPARTMENTS, DEPARTMENT_ROLES, EMPLOYMENT_TYPE_OPTIONS } from "@/lib/constants"
import { FormInput } from "@/components/ui/form-input"
import { FormSelect } from "@/components/ui/form-select"
import { FormRadioGroup } from "@/components/ui/form-radio-group"
import { Button } from "@/components/ui/button"

interface EmploymentDetailsFormProps {
  data: EmploymentDetails
  onSubmit: (data: EmploymentDetails) => void
  onBack: () => void
  onSaveDraft: () => void
}

export function EmploymentDetailsForm({ data, onSubmit, onBack, onSaveDraft }: EmploymentDetailsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmploymentDetailsInput>({
    resolver: zodResolver(employmentDetailsSchema),
    defaultValues: data,
  })

  // Watch for conditional fields
  const department = watch("department")
  const employmentType = watch("employmentType")

  // Reset role when department changes
  useEffect(() => {
    if (department && !DEPARTMENT_ROLES[department]?.includes(data.role)) {
      setValue("role", "")
    }
  }, [department, data.role, setValue])

  // Get roles based on selected department
  const roleOptions = department ? DEPARTMENT_ROLES[department].map((role) => ({ value: role, label: role })) : []

  // Scroll to first error
  useEffect(() => {
    const firstError = Object.keys(errors)[0]
    if (firstError) {
      const element = document.querySelector(`[name="${firstError}"]`)
      element?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [errors])

  const handleFormSubmit = (formData: EmploymentDetailsInput) => {
    onSubmit(formData as EmploymentDetails)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Employee ID - Read Only */}
        <FormInput
          label="Employee ID"
          {...register("employeeId")}
          readOnly
          disabled
          helpText="Auto-generated, cannot be modified"
          className="bg-muted"
        />

        {/* Department */}
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Department"
              required
              options={DEPARTMENTS.map((dept) => ({ value: dept, label: dept }))}
              value={field.value}
              onChange={field.onChange}
              error={errors.department?.message}
              placeholder="Select department"
            />
          )}
        />

        {/* Role - Dependent on Department */}
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Role"
              required
              options={roleOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.role?.message}
              placeholder="Select role"
              disabled={!department}
            />
          )}
        />

        {/* Employment Type */}
        <Controller
          name="employmentType"
          control={control}
          render={({ field }) => (
            <FormRadioGroup
              label="Employment Type"
              required
              options={EMPLOYMENT_TYPE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              error={errors.employmentType?.message}
            />
          )}
        />

        {/* Contract Dates - Conditional */}
        {employmentType === "contract" && (
          <>
            <FormInput
              label="Contract Start Date"
              type="date"
              required
              error={errors.contractStartDate?.message}
              {...register("contractStartDate")}
            />
            <FormInput
              label="Contract End Date"
              type="date"
              required
              error={errors.contractEndDate?.message}
              {...register("contractEndDate")}
              helpText="Must be after start date"
            />
          </>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            Previous
          </Button>
          <Button type="button" variant="ghost" onClick={onSaveDraft}>
            Save Draft
          </Button>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Validating..." : "Next Step"}
        </Button>
      </div>
    </form>
  )
}
