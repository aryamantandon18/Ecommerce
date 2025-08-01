import React from "react";
import { useNavigate } from "react-router-dom";

const UserOptions = ({ user,onMobile }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/account")}
      className={`relative flex items-center justify-center w-10 h-10 md:w-10 md:h-10 
        rounded-full overflow-hidden border-2 border-transparent border-yellow-300 
        transition duration-300 shadow-md
        ${onMobile ? "absolute top-[-292px]" : ""} // Position for mobile
      `}
    >
      <img
        src={user?.avatar?.url || "/Profile.png"}
        alt="Profile"
        className="w-[40px] h-[40px] object-cover rounded-full"
      />
    </button>
  );
};

export default UserOptions;
