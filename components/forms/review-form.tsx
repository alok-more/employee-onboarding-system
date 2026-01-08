// Step 5: Review & Submit Form

"use client"

import { useState } from "react"
import type { EmployeeFormData } from "@/types/employee"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Edit2, Loader2 } from "lucide-react"

interface ReviewFormProps {
  data: EmployeeFormData
  onSubmit: () => Promise<void>
  onBack: () => void
  onEditSection: (step: number) => void
}

// Helper component for displaying review items
function ReviewItem({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between py-2">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  )
}

export function ReviewForm({ data, onSubmit, onBack, onEditSection }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onSubmit()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Personal Details Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg">Personal Details</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEditSection(1)}>
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="divide-y">
          <ReviewItem label="Full Name" value={data.personalDetails.fullName} />
          <ReviewItem label="Email" value={data.personalDetails.email} />
          <ReviewItem label="Phone Number" value={data.personalDetails.phoneNumber} />
          <ReviewItem label="Date of Birth" value={data.personalDetails.dateOfBirth} />
          <ReviewItem label="Gender" value={data.personalDetails.gender} />
          <ReviewItem label="Marital Status" value={data.personalDetails.maritalStatus} />
          {data.personalDetails.maritalStatus === "married" && (
            <ReviewItem label="Spouse Name" value={data.personalDetails.spouseName} />
          )}
        </CardContent>
      </Card>

      {/* Employment Details Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg">Employment Details</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEditSection(2)}>
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="divide-y">
          <ReviewItem label="Employee ID" value={data.employmentDetails.employeeId} />
          <ReviewItem label="Department" value={data.employmentDetails.department} />
          <ReviewItem label="Role" value={data.employmentDetails.role} />
          <ReviewItem label="Employment Type" value={data.employmentDetails.employmentType} />
          {data.employmentDetails.employmentType === "contract" && (
            <>
              <ReviewItem label="Contract Start Date" value={data.employmentDetails.contractStartDate} />
              <ReviewItem label="Contract End Date" value={data.employmentDetails.contractEndDate} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Bank & Identity Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg">Bank & Identity</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEditSection(3)}>
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="divide-y">
            <ReviewItem label="Bank Name" value={data.bankAndIdentity.bankDetails.bankName} />
            <ReviewItem label="Account Number" value={data.bankAndIdentity.bankDetails.accountNumber} />
            <ReviewItem label="IFSC Code" value={data.bankAndIdentity.bankDetails.ifscCode} />
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Identity Proofs ({data.bankAndIdentity.identityProofs.length})</h4>
            {data.bankAndIdentity.identityProofs.map((proof, index) => (
              <div key={proof.id} className="p-3 bg-muted rounded-md mb-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{proof.identityType.toUpperCase()}</span>
                  <span className="font-medium">{proof.identityNumber}</span>
                </div>
                {proof.fileName && <span className="text-xs text-muted-foreground">File: {proof.fileName}</span>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg">Emergency Contacts</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onEditSection(4)}>
            <Edit2 className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.emergencyContacts.contacts.map((contact, index) => (
            <div key={contact.id} className="p-3 bg-muted rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{contact.contactName}</p>
                  <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                </div>
                <span className="text-sm">{contact.phoneNumber}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
          Previous
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            "Confirm & Submit"
          )}
        </Button>
      </div>
    </div>
  )
}
