// Success confirmation screen after form submission

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface SuccessScreenProps {
  employeeId: string
  onStartNew: () => void
}

export function SuccessScreen({ employeeId, onStartNew }: SuccessScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Submission Successful!</h2>
          <p className="text-muted-foreground mb-6">Employee onboarding form has been submitted successfully.</p>
          <div className="p-4 bg-muted rounded-lg mb-6">
            <p className="text-sm text-muted-foreground">Employee ID</p>
            <p className="text-lg font-mono font-semibold">{employeeId}</p>
          </div>
          <Button onClick={onStartNew} className="w-full">
            Start New Onboarding
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
