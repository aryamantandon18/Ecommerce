import React, { useState } from 'react';
import { SpeedDial, SpeedDialAction, Tooltip } from '@mui/material';
import { Dashboard, Person, ExitToApp, ListAlt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../actions/userActions';
import toast from 'react-hot-toast';

const UserOptions = ({ user, top, left, noOptions }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const options = [
    { icon: <ListAlt />, name: "Orders", func: () => navigate('/orders') },
    { icon: <Person />, name: "Profile", func: () => navigate('/account') },
    { icon: <ExitToApp />, name: "Logout", func: logoutUser },
  ];

  if (user && user.role === "Admin") {
    options.unshift({
      icon: <Dashboard />,
      name: "Dashboard",
      func: () => navigate('/admin/dashboard'),
    });
  }

  function logoutUser() {
    dispatch(logout());
    toast.success("Logged out successfully");
  }

  // If noOptions is true, just navigate to "/profile" on click
  const handleClick = () => {
      navigate('/account'); 
  };

  return (
    <SpeedDial
      ariaLabel="User options"
      sx={{ position: 'absolute', top: top, left: left }}
      icon={
        <img
          src={user.avatar.url ? user.avatar.url : "/Profile.png"}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover "
        />
      }
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      direction="down"
      onClick={handleClick} // Handle click event
    >
      {/* {!noOptions &&
        options.map((option) => (
          <SpeedDialAction
            key={option.name}
            icon={option.icon}
            tooltipTitle={option.name}
            onClick={option.func}
            tooltipOpen={window.innerWidth <= 600}
          />
        ))} */}
    </SpeedDial>
  );
};

export default UserOptions;
