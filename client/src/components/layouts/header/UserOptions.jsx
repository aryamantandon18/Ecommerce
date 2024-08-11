import React, { Fragment, useState } from 'react';
import { SpeedDial, SpeedDialAction, Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../actions/userActions';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

const UserOptions = ({ user }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const options = [
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: profile },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
    ];

    if (user && user.role === "Admin") {
        options.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            func: dashboard,
        });
    }

    function dashboard() {
        navigate('/admin/dashboard');
    }
    function orders() {
        navigate('/orders');
    }
    function profile() {
        navigate('/account');
    }
    function logoutUser() {
        dispatch(logout());
        toast.success("Logged out successfully");
    }

    return (
        <Fragment>
            <Tooltip title="More options" placement="bottom">
                <SpeedDial
                    ariaLabel="SpeedDial tooltip example"
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    open={open}
                    direction="down"
                    className="speedDial"
                    icon={
                        <img
                            className='speedDialIcon'
                            src={user.avatar.url ? user.avatar.url : "/Profile.png"}
                            alt='Profile'
                        />
                    }
                >
                    {options.map((item) => (
                        <SpeedDialAction
                            key={item.name}
                            icon={item.icon}
                            tooltipTitle={item.name}
                            onClick={item.func}
                            tooltipOpen={window.innerWidth <= 600 ? true : false}
                            tooltipPlacement="right"
                        />
                    ))}
                </SpeedDial>
            </Tooltip>
        </Fragment>
    );
}

export default UserOptions;
