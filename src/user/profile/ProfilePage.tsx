"use client";

import { ProfileView } from "./ProfileView";
import { useProfilePage } from "./useProfilePage";

export function ProfilePage() {
  const profile = useProfilePage();

  return (
    <ProfileView
      email={profile.email}
      greetingName={profile.greetingName}
      building={profile.building}
      savedBuilding={profile.savedBuilding}
      pageState={profile.pageState}
      message={profile.message}
      isError={profile.isError}
      isAuthenticated={profile.isAuthenticated}
      isSigningOut={profile.isSigningOut}
      logoutError={profile.logoutError}
      changeAvailableAt={profile.changeAvailableAt}
      isBuildingChangeLocked={profile.isBuildingChangeLocked}
      onBuildingChange={profile.setBuilding}
      onMessageClear={() => profile.setMessage("")}
      onSignOut={() => void profile.signOutUser()}
      onSubmit={(event) => void profile.submit(event)}
    />
  );
}
