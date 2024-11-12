import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, loadUser, updateProfile } from '../../actions/userActions';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstant';
import toast from 'react-hot-toast';
import Loader from '../layouts/loader/Loader';

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.user);
    const { error, isUpdated, loading } = useSelector(state => state.profile);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatarPreview, setAvatarPreview] = useState('/Profile.png');
    const [avatar, setAvatar] = useState('/Profile.png');

    const updateUserHandler = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("avatar", avatar);
        dispatch(updateProfile(myForm));
    };

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            if (user.avatar && user.avatar.url) {
                setAvatarPreview(user.avatar.url);
            }
        }
        if (error) {
            toast.error(error.message);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            toast.success("Profile Updated Successfully");
            dispatch(loadUser());
            navigate("/account");
            dispatch({ type: UPDATE_PROFILE_RESET });
        }
    }, [dispatch, error, navigate, user, isUpdated]);

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 border-l-4 border-blue-500 pl-3">
                            Update Profile
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4 flex text-center">
                                <img
                                    src={avatarPreview}
                                    alt="Avatar"
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={updateUserHandler}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-blue-700 hover:file:bg-green-100"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default UpdateProfile;
