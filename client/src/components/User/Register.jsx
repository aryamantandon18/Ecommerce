import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, register } from "../../actions/userActions";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import toast from "react-hot-toast";
import { CameraAlt } from "@mui/icons-material";

const Register = () => {
  const [show, setShow] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");
  const [avatar, setAvatar] = useState("/Profile.png");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
  });

  const { error, isAuthenticated } = useSelector((state) => state.user);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const { name, email, password, role } = user;

  const validatePassword = (value) => {
    const validations = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };
    setPasswordValidations(validations);
    return validations;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validations = validatePassword(password);
    const errors = [];
    if (!validations.length)
      errors.push("Password must be at least 8 characters.");
    if (!validations.uppercase)
      errors.push("Password must contain at least one uppercase letter.");
    if (!validations.specialChar)
      errors.push("Password must contain at least one special character.");

    if (errors.length > 0) {
      errors.forEach((msg) => toast.error(msg));
      return;
    }

    const myForm = new FormData();
    console.log("Line 29 ", avatar);
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("role", role);
    myForm.set("avatar", avatar);

    dispatch(register(myForm));
  };

  const registerUserHandler = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result); // Store the preview for the UI
          setAvatar(file); // Store the file object for upload
        }
      };
      reader.readAsDataURL(file);
    } else {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });
      if (name === "password") validatePassword(value);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated) {
      navigate("/");
    }
  }, [dispatch, error, isAuthenticated, navigate]);

  return (
    // bg-gradient-to-r from-blue-400 to-purple-500
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500" 
      // style={{
      //   backgroundImage:"linear-gradient(rgba(200,200,200,0.5),rgba(120,110,220,0.5))",
      // }}
    >
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 animate-fromDown">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 border-l-4 border-blue-500 pl-3">
          Register Here
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center justify-center relative">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 relative"
            />
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={registerUserHandler}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="absolute bottom-2 right-20 bg-white p-2 rounded-full shadow-lg cursor-pointer">
              <CameraAlt
                className="text-gray-700"
                onClick={() =>
                  document.querySelector('input[type="file"]').click()
                }
              />
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="name"
              value={name}
              onChange={registerUserHandler}
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={show ? "text" : "password"}
              name="password"
              value={password}
              onChange={registerUserHandler}
              placeholder="Password"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {show ? (
                <VisibilityOff className="h-5 w-5" />
              ) : (
                <Visibility className="h-5 w-5" />
              )}
            </button>
          </div>
          {passwordFocused && (
            <div className="mb-4 space-y-2 text-sm transition-all duration-300 animate-fadeIn">
              <div className="flex items-center">
                <svg
                  className={`w-5 h-5 mr-2 ${
                    passwordValidations.length
                      ? "text-green-600"
                      : "text-blue-500"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className={`${
                    passwordValidations.length
                      ? "text-green-700"
                      : "text-gray-800"
                  }`}
                >
                  Minimum 8 characters
                </span>
              </div>

              <div className="flex items-center">
                <svg
                  className={`w-5 h-5 mr-2 ${
                    passwordValidations.uppercase
                      ? "text-green-600"
                      : "text-blue-500"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className={`${
                    passwordValidations.uppercase
                      ? "text-green-700"
                      : "text-gray-800"
                  }`}
                >
                  At least one uppercase letter
                </span>
              </div>

              <div className="flex items-center">
                <svg
                  className={`w-5 h-5 mr-2 ${
                    passwordValidations.specialChar
                      ? "text-green-600"
                      : "text-blue-500"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className={`${
                    passwordValidations.specialChar
                      ? "text-green-700"
                      : "text-gray-800"
                  }`}
                >
                  At least one special character (!@#$...)
                </span>
              </div>
            </div>
          )}
          <div className="mb-4">
            <select
              name="role"
              value={role}
              onChange={registerUserHandler}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-md transition duration-300 bg-blue-500 text-white hover:bg-blue-600`}
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/login" className="text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
