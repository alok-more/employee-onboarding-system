// Step 4: Emergency Contacts Form

"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import type { EmergencyContacts, EmergencyContact } from "@/types/employee"
import { emergencyContactsSchema, type EmergencyContactsInput } from "@/lib/validation-schemas"
import { RELATIONSHIP_OPTIONS, VALIDATION_RULES } from "@/lib/constants"
import { generateUniqueId } from "@/lib/storage"
import { FormInput } from "@/components/ui/form-input"
import { FormSelect } from "@/components/ui/form-select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { Controller } from "react-hook-form"

interface EmergencyContactsFormProps {
  data: EmergencyContacts
  onSubmit: (data: EmergencyContacts) => void
  onBack: () => void
  onSaveDraft: () => void
}

export function EmergencyContactsForm({ data, onSubmit, onBack, onSaveDraft }: EmergencyContactsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmergencyContactsInput>({
    resolver: zodResolver(emergencyContactsSchema),
    defaultValues: data,
  })

  // Dynamic contacts array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  })

  // Scroll to first error
  useEffect(() => {
    const errorKeys = Object.keys(errors)
    if (errorKeys.length > 0) {
      const element = document.querySelector('[aria-invalid="true"]')
      element?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [errors])

  const addContact = () => {
    if (fields.length < VALIDATION_RULES.maxEmergencyContacts) {
      const newContact: EmergencyContact = {
        id: generateUniqueId(),
        contactName: "",
        relationship: "",
        phoneNumber: "",
      }
      append(newContact)
    }
  }

  const handleFormSubmit = (formData: EmergencyContactsInput) => {
    onSubmit(formData as EmergencyContacts)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            Emergency Contacts ({fields.length}/{VALIDATION_RULES.maxEmergencyContacts})
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addContact}
            disabled={fields.length >= VALIDATION_RULES.maxEmergencyContacts}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Contact
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">Contact {index + 1}</span>
                {fields.length > VALIDATION_RULES.minEmergencyContacts && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <FormInput
                  label="Contact Name"
                  required
                  error={errors.contacts?.[index]?.contactName?.message}
                  {...register(`contacts.${index}.contactName`)}
                  placeholder="Enter contact name"
                />
                <Controller
                  name={`contacts.${index}.relationship`}
                  control={control}
                  render={({ field: selectField }) => (
                    <FormSelect
                      label="Relationship"
                      required
                      options={RELATIONSHIP_OPTIONS.map((rel) => ({ value: rel, label: rel }))}
                      value={selectField.value}
                      onChange={selectField.onChange}
                      error={errors.contacts?.[index]?.relationship?.message}
                    />
                  )}
                />
                <FormInput
                  label="Phone Number"
                  type="tel"
                  required
                  error={errors.contacts?.[index]?.phoneNumber?.message}
                  {...register(`contacts.${index}.phoneNumber`)}
                  placeholder="10 digit number"
                />
              </div>
            </div>
          ))}
          {errors.contacts?.message && <p className="text-sm text-destructive">{errors.contacts.message}</p>}
          <p className="text-sm text-muted-foreground">
            Minimum {VALIDATION_RULES.minEmergencyContacts}, Maximum {VALIDATION_RULES.maxEmergencyContacts} contacts
            required
          </p>
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
          {isSubmitting ? "Validating..." : "Review & Submit"}
        </Button>
      </div>
    </form>
  )
}
