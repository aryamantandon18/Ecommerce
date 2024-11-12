import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, updatePassword } from '../../actions/userActions';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstant';
import toast from 'react-hot-toast';
import Loader from '../layouts/loader/Loader';
import MetaData from '../layouts/MetaData';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

const UpdatePassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, isUpdated, loading } = useSelector((state) => state.profile);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("oldPassword", oldPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("confirmPassword", confirmPassword);
        dispatch(updatePassword(myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            toast.success("Password Updated Successfully");
            navigate("/account");
            dispatch({ type: UPDATE_PASSWORD_RESET });
        }
    }, [dispatch, error, navigate, isUpdated]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Change Password" />
                    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
                        <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 border-l-4 border-blue-500 pl-3">
                                Update Password
                            </h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 flex items-center space-x-2">
                                    <VpnKeyIcon className="text-blue-500" />
                                    <input
                                        type="password"
                                        placeholder="Old Password"
                                        name="oldPassword"
                                        required
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4 flex items-center space-x-2">
                                    <LockOpenIcon className="text-blue-500" />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        name="newPassword"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="mb-4 flex items-center space-x-2">
                                    <LockIcon className="text-blue-500" />
                                    <input
                                        type="password"
                                        placeholder="Confirm Password"
                                        name="confirmPassword"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default UpdatePassword;
