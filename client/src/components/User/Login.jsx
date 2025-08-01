import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, login } from '../../actions/userActions';
import toast from 'react-hot-toast';
import Loader from '../layouts/loader/Loader';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
    const [show, setShow] = useState(false);
    const navigate = useNavigate();
    const emailElement = useRef();
    const passwordElement = useRef();
    const dispatch = useDispatch();
    const { error, loading, isAuthenticated } = useSelector(state => state.user);

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = emailElement.current.value;
        const password = passwordElement.current.value;
        dispatch(login(email, password));
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    useEffect(()=>{
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    },[dispatch, error])

    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <div className={`flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500`}
                // style={{
                //     backgroundImage:"linear-gradient(rgba(200,200,200,0.5),rgba(120,110,220,0.5))",
                //   }}
                >
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96 animate-fromDown ">
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 border-l-4 border-blue-500 pl-3">
                            Login Here
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    ref={emailElement}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4 relative">
                                <input
                                    type={show ? 'text' : 'password'}
                                    placeholder="Password"
                                    ref={passwordElement}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShow(!show)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                >
                                    {show ? <VisibilityOff className="h-5 w-5" /> : <Visibility className="h-5 w-5" />}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Login
                            </button>
                        </form>
                        <div className="mt-4 text-center">
                            <Link to="/register" className="text-blue-500 hover:underline">
                                Don't have an account? Sign Up
                            </Link>
                        </div>
                        <div className="mt-2 text-center">
                            <Link to="/password/forgot" className="text-blue-500 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default Login;
