import React, { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { forgotPassword, clearErrors } from '../../actions/userActions';
import toast from 'react-hot-toast';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import Loader from '../layouts/loader/Loader';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const { error, loading, message } = useSelector((state) => state.forgotPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("email", email);
        dispatch(forgotPassword(myForm));
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
        if (message) {
            toast.success(message);
        }
    }, [error, message, dispatch]);

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <motion.div
                    className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="bg-white p-8 rounded-lg shadow-xl w-96"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 border-l-4 border-blue-500 pl-3">
                            Forgot Password
                        </h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <MailOutlineIcon className="absolute left-3 top-2 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Send
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </Fragment>
    );
};

export default ForgotPassword;
