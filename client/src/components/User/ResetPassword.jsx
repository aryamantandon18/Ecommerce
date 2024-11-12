import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../layouts/loader/Loader';
import MetaData from '../layouts/MetaData';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { clearErrors, resetPassword } from '../../actions/userActions';

const ResetPassword = () => {
    let { token } = useParams();
    const dispatch = useDispatch();
    const { error, success, loading } = useSelector((state) => state.forgotPassword);
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);
        dispatch(resetPassword(token, myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error.message);
            dispatch(clearErrors());
        }
        console.log("Line 33 ",success);
        if (success) {
            console.log("Line 34");
            toast.success("Password Updated Successfully");
            setPassword("");
            setConfirmPassword("");
            navigate("/login");
        }
    }, [dispatch, error, navigate, success]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="Reset Password" />
                    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
                        <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 border-l-4 border-blue-500 pl-3">
                                Reset Password
                            </h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4 flex items-center space-x-2">
                                    <LockOpenIcon className="text-blue-500" />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        name="newPassword"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

export default ResetPassword;
