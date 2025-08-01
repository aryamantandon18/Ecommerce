import { Rating } from '@mui/material';
import React from 'react';
import { Link } from "react-router-dom";

export const ProductCard = ({ product }) => {
    const options = {
        value: product.rating,
        readOnly: true,
        precision: 0.5,
    };
    
    return (
        <Link className="flex flex-col items-center text-gray-800 shadow-md hover:shadow-xl transition-all duration-500 p-2 m-2 w-[14vmax] hover:translate-y-[-0.5vmax] border-gray-200 border-2 " to={`/product/${product._id}`}>
            <img className="w-[14vmax] h-[14vmax] object-cover hover:scale-105 transition-transform duration-500 mb-2" src={product?.images && product?.images[0]?.url} alt={product?.name} />
            <p className="font-roboto text-[1.2vmax] my-1">{product?.name}</p>
            <div className="flex items-center sm:space-x-2 sm:my-1 flex-wrap ">
                <Rating {...options} sx={{fontSize:{xs:"10px",md:"20px"}}}/>
                <span className="font-roboto text-[0.7vmax]">{`(${product?.numOfReviews} Reviews)`}</span>
            </div>
            <span className="text-red-500 font-sans text-[1vmax]">{`₹${product?.price}`}</span>
        </Link>
    );
};
