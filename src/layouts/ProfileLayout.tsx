import React from "react";
import { Outlet } from "react-router-dom";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import Header from "../components/Header";

const ProfileLayout: React.FC = () => {
  return (
    <div>
      <Header />
      <div className=" mx-20 px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <ProfileSidebar />
          <div className="md:w-2/3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
