import React, { Fragment, useEffect, useState } from 'react'
import './product.css'
import Loader from '../layouts/loader/Loader'
import { useDispatch, useSelector } from 'react-redux'
import { getProduct } from '../../actions/productActions'
import { ProductCard } from '../Home/ProductCard'
// import { useNavigate} from 'react-router-dom'
import Pagination from 'react-js-pagination'
import MetaData from '../layouts/MetaData'
import {toast} from'react-hot-toast'
import { Button, Slider } from '@mui/material'
import {Typography} from '@mui/material'
// import { Filter } from './Filter.jsx'


const categories = [
  "Laptop",
  "Footwear",
  "Phone",
  "Tops",
  "Electronics",
  "Camera",
  "SmartPhones",
  "Shoes",
  "Watch",
];

const Products = () => {
  const [currentPage,setCurrentPage] = useState(1);
  const [price,setPrice] = useState([0,50000]);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");

 
  
  const setCurrentPageNo = (e)=>{
    setCurrentPage(e);
  }
// console.log(currentPage);


  const dispatch = useDispatch();
  // const {keyword} = useParams();
  const {products,loading,error,productsCount,resultPerPage} = useSelector((state)=>state.products);

  const priceHandler=(e,newPrice)=>{
setPrice(newPrice);
  }
  const [finalKeyword,setFinalKeyword] = useState();

  useEffect(()=>{
    if(error) {return toast.error(error);}
    dispatch(getProduct(finalKeyword,currentPage,price,rating,category));
  },[dispatch,finalKeyword,currentPage,error,price,rating,category])


  // const count = filteredProductsCount;
  return (
    <Fragment>
       <MetaData title="PRODUCTS -- ECOMMERCE" />
      {loading?<Loader/>:(
        <Fragment>
       <div className='p-wrapper'>
   
        
        <h2 className='productsHeading'>Products</h2>
        <div className='products'>
        {
          products && products.map((product)=>(
            <ProductCard key={product._id} product={product}/>
          ))
        }
        </div>
        </div>
       
        
         <div className="filterBox">
          <Typography>Price</Typography>           
         <Slider
         value={price}
         onChange={priceHandler}
         valueLabelDisplay='auto'
         aria-labelledby='range-slider'
         min={0}
         max={50000}
         size='small'
         />
             <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={rating}
                onChange={(e,newRating) => {
                  setRating(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
        </div>

     
        {
          resultPerPage < productsCount && (
            <div className="paginationBox">
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={resultPerPage}
              totalItemsCount={productsCount}
              onChange={setCurrentPageNo}
              nextPageText="Next"
              prevPageText="Prev"
              firstPageText="1st"
              lastPageText="Last"
              itemClass="page-item"
              linkClass="page-link"
              activeClass="pageItemActive"
              activeLinkClass="pageLinkActive"
            />
          </div>   )
        }
        </Fragment>
      )}
    </Fragment>
  )
}

export default Products