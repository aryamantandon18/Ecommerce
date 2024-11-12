import React, { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { saveShippingInfo } from '../../actions/cartActions';
import { Country, State } from 'country-state-city';
import MetaData from '../layouts/MetaData';
import CheckOutSteps from './CheckOutSteps';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PinDropIcon from '@mui/icons-material/PinDrop';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';

const Shipping = () => {
    const { shippingInfo } = useSelector((state) => state.cart);
    const [address, setAddress] = useState(shippingInfo.address);
    const [state, setState] = useState(shippingInfo.state);
    const [city, setCity] = useState(shippingInfo.city);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
    const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
    const [country, setCountry] = useState(shippingInfo.country);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (phoneNo.length !== 10) {
            toast.error("Phone Number should be of 10 digits");
            return;
        }
        dispatch(saveShippingInfo({ address, state, country, city, pinCode, phoneNo }));
        navigate("/order/confirm");
    };

    return (
        <Fragment>
            {/* <CheckOutSteps activeStep={0} /> */}
            <MetaData title="Shipping Info" />
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 mt-12 sm:mt-0">
                <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                    <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 border-l-4 border-blue-500 pl-3">
                        Shipping Info
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Address Input */}
                        <div className="flex items-center space-x-2">
                            <HomeIcon className="text-blue-500" />
                            <input
                                type="text"
                                placeholder="Address"
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* City Input */}
                        <div className="flex items-center space-x-2">
                            <LocationCityIcon className="text-blue-500" />
                            <input
                                type="text"
                                placeholder="City"
                                required
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Pin Code Input */}
                        <div className="flex items-center space-x-2">
                            <PinDropIcon className="text-blue-500" />
                            <input
                                type="number"
                                placeholder="Pin Code"
                                required
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Phone Number Input */}
                        <div className="flex items-center space-x-2">
                            <PhoneIcon className="text-blue-500" />
                            <input
                                type="number"
                                placeholder="Phone Number"
                                required
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Country Dropdown */}
                        <div className="flex items-center space-x-2">
                            <PublicIcon className="text-blue-500" />
                            <select
                                required
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" style={{ color: "Black" }}>
                                    Country
                                </option>
                                {Country &&
                                    Country.getAllCountries().map((item) => (
                                        <option key={item.isoCode} style={{ color: "Black" }} value={item.isoCode}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* State Dropdown */}
                        {Country && (
                            <div className="flex items-center space-x-2">
                                <TransferWithinAStationIcon className="text-blue-500" />
                                <select
                                    required
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option>State</option>
                                    {State &&
                                        State.getStatesOfCountry(country).map((item) => (
                                            <option key={item.isoCode} style={{ color: "Black" }} value={item.isoCode}>
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    );
};

export default Shipping;
