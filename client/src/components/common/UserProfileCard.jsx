import React from "react";
import "@styles/layout/UserProfileCard.css";

const UserProfileCard = ({ children }) => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        {children}
      </div>
    </div>
  );
};

export default UserProfileCard;
