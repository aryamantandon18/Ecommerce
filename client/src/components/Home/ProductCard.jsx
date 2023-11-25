import React from 'react'
import RatingStars from 'react-rating-stars-component'
import {Link} from "react-router-dom";


export const ProductCard =({product})=>{
    const options={
        value: product.rating,
        readOnly: true,
        precision: 0.5,
        isHalf:true,
    }
    return(
        <Link className='productCard' to={`/products/${product._id}`}>
            <img src={product.images[0].url} alt={product.name}/>
            <p>{product.name}</p>
      <div>
        <RatingStars {...options} />
        <span className="productCardSpan">
          ({product.numOfReviews} Reviews)
        </span>
      </div>
      <span>{`₹${product.price}`}</span>
      <button style={{fontStyle:"oblique", border:"1px solid black"}}> Buy Now</button>
        </Link>
    )
}