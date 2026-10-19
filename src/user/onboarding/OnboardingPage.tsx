"use client";

import { OnboardingView } from "./OnboardingView";
import { useOnboarding } from "./useOnboarding";

export function OnboardingPage() {
  const onboarding = useOnboarding();

  return (
    <OnboardingView
      building={onboarding.building}
      guidelinesAccepted={onboarding.guidelinesAccepted}
      pageState={onboarding.pageState}
      error={onboarding.error}
      userEmail={onboarding.userEmail}
      onBuildingChange={(building) => {
        onboarding.setBuilding(building);
        onboarding.setError("");
      }}
      onGuidelinesAcceptedChange={(accepted) => {
        onboarding.setGuidelinesAccepted(accepted);
      }}
      onSubmit={(event) => void onboarding.submit(event)}
      onRetry={() => window.location.reload()}
    />
  );
}
