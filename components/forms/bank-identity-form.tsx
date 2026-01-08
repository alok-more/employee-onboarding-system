// Step 3: Bank & Identity Form

"use client"

import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import type { BankAndIdentity, IdentityProof } from "@/types/employee"
import { bankAndIdentitySchema, type BankAndIdentityInput } from "@/lib/validation-schemas"
import { IDENTITY_TYPE_OPTIONS } from "@/lib/constants"
import { generateUniqueId } from "@/lib/storage"
import { FormInput } from "@/components/ui/form-input"
import { FormSelect } from "@/components/ui/form-select"
import { FileUpload } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface BankIdentityFormProps {
  data: BankAndIdentity
  onSubmit: (data: BankAndIdentity) => void
  onBack: () => void
  onSaveDraft: () => void
}

export function BankIdentityForm({ data, onSubmit, onBack, onSaveDraft }: BankIdentityFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BankAndIdentityInput>({
    resolver: zodResolver(bankAndIdentitySchema),
    defaultValues: data,
  })

  // Dynamic identity proofs array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "identityProofs",
  })

  // Scroll to first error
  useEffect(() => {
    const errorKeys = Object.keys(errors)
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0]
      const element = document.querySelector(`[name="${firstErrorKey}"]`)
      element?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [errors])

  const addIdentityProof = () => {
    const newProof: IdentityProof = {
      id: generateUniqueId(),
      identityType: "aadhaar",
      identityNumber: "",
      file: null,
      fileName: "",
    }
    append(newProof)
  }

  const handleFormSubmit = (formData: BankAndIdentityInput) => {
    onSubmit(formData as BankAndIdentity)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Bank Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bank Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <FormInput
            label="Bank Name"
            required
            error={errors.bankDetails?.bankName?.message}
            {...register("bankDetails.bankName")}
            placeholder="Enter bank name"
          />
          <FormInput
            label="Account Number"
            required
            error={errors.bankDetails?.accountNumber?.message}
            {...register("bankDetails.accountNumber")}
            placeholder="Enter account number"
            helpText="9-18 digits"
          />
          <FormInput
            label="IFSC Code"
            required
            error={errors.bankDetails?.ifscCode?.message}
            {...register("bankDetails.ifscCode")}
            placeholder="e.g., SBIN0001234"
            helpText="Format: 4 letters + 0 + 6 alphanumeric"
            className="uppercase"
          />
        </CardContent>
      </Card>

      {/* Identity Proofs Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Identity Proofs</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addIdentityProof}>
            <Plus className="h-4 w-4 mr-1" />
            Add Proof
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-destructive hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <Controller
                  name={`identityProofs.${index}.identityType`}
                  control={control}
                  render={({ field: selectField }) => (
                    <FormSelect
                      label="Identity Type"
                      required
                      options={IDENTITY_TYPE_OPTIONS}
                      value={selectField.value}
                      onChange={selectField.onChange}
                      error={errors.identityProofs?.[index]?.identityType?.message}
                    />
                  )}
                />
                <FormInput
                  label="Identity Number"
                  required
                  error={errors.identityProofs?.[index]?.identityNumber?.message}
                  {...register(`identityProofs.${index}.identityNumber`)}
                  placeholder="Enter identity number"
                />
                <div className="md:col-span-2">
                  <Controller
                    name={`identityProofs.${index}.file`}
                    control={control}
                    render={({ field }) => (
                      <FileUpload
                        label="Upload Document"
                        fileName={field.value?.name || ""}
                        onFileSelect={(file) => {
                          field.onChange(file)
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
          {errors.identityProofs?.message && (
            <p className="text-sm text-destructive">{errors.identityProofs.message}</p>
          )}
        </CardContent>
      </Card>

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
