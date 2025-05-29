import React from "react";
import { Outlet } from "react-router-dom";
import ProfileSidebar from "../components/profile/ProfileSidebar";

const ProfileLayout: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <ProfileSidebar />
        <div className="md:w-2/3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
