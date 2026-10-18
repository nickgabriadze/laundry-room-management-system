"use client";

import { SignInView } from "./SignInView";
import { useSignIn } from "./useSignIn";

export function SignInPage() {
  const signIn = useSignIn();

  return (
    <SignInView
      isSigningIn={signIn.isSigningIn}
      isCheckingSession={signIn.isCheckingSession}
      error={signIn.error}
      onSignIn={() => void signIn.signIn()}
    />
  );
}
