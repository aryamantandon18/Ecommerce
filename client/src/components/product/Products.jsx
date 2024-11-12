import React, { Fragment, useContext, useEffect, useState } from 'react'
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
import { AppContext } from '../..'
// import { Filter } from './Filter.jsx'


const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Electronics",
  "Camera",
  "SmartPhones",
  "Cars",
  "Shoes",
  "Watch",
  "women",
  "men",
];

const Products = () => {
  const {currentPage,setCurrentPage, price,setPrice,rating, setRating,
    category,
    setCategory,
    finalKeyword,
    setFinalKeyword
  } = useContext(AppContext);
  
  const setCurrentPageNo = (e)=>{
    setCurrentPage(e);
  }
  const dispatch = useDispatch();
  // const {keyword} = useParams();
  const {products,loading,error,productsCount,resultPerPage} = useSelector((state)=>state.products);

  const priceHandler=(e,newPrice)=>{
setPrice(newPrice);
  }
  const handleCategoryClick = (category) => {
    setFinalKeyword("");
    setCategory(category);
  };
  useEffect(() => {
    if (error) { 
      toast.error(error);
      return;
    }
    dispatch(getProduct(finalKeyword, currentPage, price, rating, category));
  }, [dispatch,currentPage, error, price, rating, category]);
  


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
                  onClick={() => handleCategoryClick(category)}
                  style={{ cursor: 'pointer' }}
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