import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
// import Carousel from 'react-material-ui-carousel';
import {useSelector, useDispatch } from 'react-redux';
import { getProductDetails } from '../../actions/productActions'
import Loader from '../layouts/loader/Loader';
import toast from 'react-hot-toast';
import ReactStars from 'react-stars'
import './productDetails.js'
import './productDetails.css'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ReviewCard from'./ReviewCard.jsx';

const ProductDetails = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {product,loading,error} = useSelector((state) => state.productDetails);  //to pull data from the redux store.(from the reducer)
    const [quantity, setQuantity] = useState(1);
    // const [open, setOpen] = useState(false);
    // const [rating, setRating] = useState(0);
    // const [comment, setComment] = useState("");
    const increaseQuantity = () => {
        if (product.stock <= quantity) return;
    
        const qty = quantity + 1;
        setQuantity(qty);
      };
    
      const decreaseQuantity = () => {
        if (1 >= quantity) return;
    
        const qty = quantity - 1;
        setQuantity(qty);
      };
    
    useEffect(()=>{
        dispatch(getProductDetails(id));           //like in backend we use req.params.id to access the product is 
    },[dispatch,id])

    const options={
        value: 2,
        readOnly: true,
        precision: 0.5,
        isHalf:true,
        half:true, 
        edit:false,
    }

  return ( 
<Fragment>
   
    {loading?(<Loader/>):error?(toast.error(error.message))
    :product?(
  <Fragment>       
   <div className='ProductDetails'>
    <div>
    <Carousel showStatus={false} showArrows={true} infiniteLoop={false}   showThumbs={true}>
        {
            product.images && 
            product.images.map((item,i)=>(
                <img className='CarouselImage' style={{position:'relative'}}
                key={item.url}
                src={item.url}
                alt={`${i} slide`}
                />
            ))
        }
    </Carousel>   
    </div> 
<div>                                                  {/* Second main div  */}
    <div className='detailsBlock-1'>
    <h2>{product.name}</h2>
    <p>Product # {product._id}</p>
    </div>
    <div className='detailsBlock-2'>
    <ReactStars {...options}/>
    <span> ({product.numOfReviews} Reviews )</span>
    </div>
    <div className='detailsBlock-3'>
    <h1>{`₹${product.price}`}</h1>
    <div className='detailsBlock-3-1'>
      <div className='detailsBlock-3-1-1'>
        <button onClick={decreaseQuantity}>-</button>
        <input readOnly type='number' value={quantity} />
        <button onCLick={increaseQuantity}>+</button>
      </div>
      <button>Add to Cart</button>
    </div>
    <p>
      Status:
      <b className={product.stock<1? "redColor" : "greenColor"}>
        {product.stock < 1 ? "OutOfStock" : "InStock"}
      </b>
    </p>
    </div>    
         <div className='detailsBlock-4'>
          Description: <p>{product.description}</p>
         </div>
          <button className='submitReview'>Submit Review</button>
      </div>                                              {/*  Second main div          */}
    </div>                                    
      <h3 className='reviewHeading'>REVIEWS</h3>  
      {product.reviews && product.reviews[0] ?(
        <div className='reviews'> 
        {product.reviews && product.reviews.map( (review)=> <ReviewCard review={review}/>) }
        </div>
      ) : (
        <p className='noReviews'>No Reviews Yet</p>
      )}
   
    </Fragment>
):(<h1>No product data Available</h1>)  }
  
</Fragment>
  )
}

export default ProductDetails