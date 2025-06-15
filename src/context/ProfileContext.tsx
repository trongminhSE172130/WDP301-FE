import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../service/api/authApi";

export interface PushNotificationSettings {
  booking_reminders: boolean;
  subscription_alerts: boolean;
  reproductive_tracking: boolean;
  blog_updates: boolean;
  consultation_updates: boolean;
}

export interface ProfileData {
  _id: string;
  full_name: string;
  email: string;
  gender: string;
  dob: string;
  phone: string;
  role: string;
  avatar?: string;
  location?: string;
  push_notification_settings?: PushNotificationSettings;
}

interface ProfileContextType {
  profile: ProfileData | null;
  setProfile: React.Dispatch<React.SetStateAction<ProfileData | null>>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const refreshProfile = async () => {
    const res = await getProfile();
    setProfile(res.data.data);
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}; 