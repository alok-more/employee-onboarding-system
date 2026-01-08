// Main page that renders the Employee Onboarding Wizard

import { EmployeeOnboardingWizard } from "@/components/employee-onboarding-wizard"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <EmployeeOnboardingWizard />
      <Toaster />
    </main>
  )
}
