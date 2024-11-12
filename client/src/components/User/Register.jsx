import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../../actions/userActions';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import toast from 'react-hot-toast';
import { CLEAR_ERRORS } from '../../constants/userConstant';

const Register = () => {
    const [show, setShow] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState('/Profile.png');
    const [avatar, setAvatar] = useState('/Profile.png');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { error, loading, isAuthenticated } = useSelector(state => state.user);

    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
    });
    const { name, email, password } = user;
    const [role, setRole] = useState('user');

    const handleSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("role", role);
        myForm.set("avatar", avatar);
        dispatch(register(myForm));
    };

    const registerUserHandler = (e) => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: CLEAR_ERRORS });
        }   
        if (isAuthenticated) {
            navigate("/");
        }
    }, [dispatch, error, isAuthenticated, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
            <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 border-l-4 border-green-500 pl-3">Register Here</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input 
                            type="text" 
                            name="name"
                            value={name}
                            onChange={registerUserHandler}
                            placeholder="Username" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <input 
                            type="email" 
                            name="email"
                            value={email}
                            onChange={registerUserHandler}
                            placeholder="Email" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required 
                        />
                    </div>
                    <div className="mb-4 relative">
                        <input 
                            type={show ? 'text' : 'password'} 
                            name="password"
                            value={password}
                            onChange={registerUserHandler}
                            placeholder="Password" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    <div className="mb-4">
                        <select 
                            name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="mb-4 flex items-center">
                        <img src={avatarPreview} alt="Avatar Preview" className="w-12 h-12 rounded-full mr-4" />
                        <input 
                            type="file" 
                            name="avatar"
                            accept="image/*" 
                            onChange={registerUserHandler}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <Link to="/login" className="text-green-500 hover:underline">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
