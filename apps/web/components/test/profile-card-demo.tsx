"use client";

import { useState } from "react";
import { UserProfileCard } from "@/components/UserProfileCard/UserProfileCard";
import { ProfileEditModal } from "@/components/UserProfileCard/ProfileEditModal";
import type { UserProfileData } from "@/components/UserProfileCard/UserProfileCard.types";

const INITIAL_PROFILE: UserProfileData = {
  id: "profile-demo-1",
  name: "Iraima Hurtado",
  phone: "+54 11 5555 0101",
  email: "iraima@hallo.one",
  avatarUrl: null,
};

export function ProfileCardDemo() {
  const [profile, setProfile] = useState<UserProfileData>(INITIAL_PROFILE);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="w-full md:w-1/2">
        <UserProfileCard
          data={profile}
          description="Así te ven los propietarios cuando contactás por una propiedad."
          onEdit={() => setIsEditing(true)}
        />
      </div>

      {isEditing ? (
        <ProfileEditModal
          profile={profile}
          onSave={(updated) => {
            setProfile(updated);
            setIsEditing(false);
          }}
          onClose={() => setIsEditing(false)}
        />
      ) : null}
    </>
  );
}
