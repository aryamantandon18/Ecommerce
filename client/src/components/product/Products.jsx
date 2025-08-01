import React, { Fragment, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../../actions/productActions';
import { ProductCard } from '../Home/ProductCard';
import Pagination from 'react-js-pagination';
import { toast } from 'react-hot-toast';
import { Slider, Typography } from '@mui/material';
import { AppContext } from '../..';
import Loader from '../layouts/loader/Loader';
import MetaData from '../layouts/MetaData';
import "./product.css"
const categories = [
  "Laptop", "Footwear", "Bottom", "Tops", "Electronics", 
  "Camera", "SmartPhones", "Cars", "Shoes", "Watch", "Women", "Men",
];

const Products = () => {
  const { currentPage, setCurrentPage, price, setPrice, rating, setRating, category, setCategory, finalKeyword, setFinalKeyword } = useContext(AppContext);
  
  const dispatch = useDispatch();
  const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.products);

  const setCurrentPageNo = (e) => setCurrentPage(e);

  const priceHandler = (e, newPrice) => setPrice(newPrice);

  const handleCategoryClick = (cat) => {
    setFinalKeyword("");
    setCategory(cat);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }
    dispatch(getProduct(finalKeyword, currentPage, price, rating, category));
  }, [dispatch, currentPage, error, price, rating, category, finalKeyword]);

  return (
<Fragment>
  <MetaData title="Products - ECommerce" />
  <div className="min-h-screen pt-28 px-4 sm:px-8">
    {/* Heading */}
    <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">All Products</h1>

    {/* Filters & Products Grid */}
    <div className="flex flex-col md:flex-row gap-8 mb-8">
      {/* Left Filters */}
      <div className="w-full md:w-1/4 space-y-8">
        {/* Price Filter */}
        <div className="bg-white p-4 rounded shadow">
          <Typography variant="h6" className="mb-4">Price Range</Typography>
          <Slider
            value={price}
            onChange={priceHandler}
            valueLabelDisplay="auto"
            min={0}
            max={50000}
            sx={{ color: 'tomato' }}
          />
        </div>

        {/* Category Filter */}
        <div className="bg-white p-4 rounded shadow">
          <Typography variant="h6" className="mb-4">Categories</Typography>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="text-gray-700 cursor-pointer hover:text-tomato transition-all"
              >
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Rating Filter */}
        <div className="bg-white p-4 rounded shadow">
          <Typography variant="h6" className="mb-4">Ratings Above</Typography>
          <Slider
            value={rating}
            onChange={(e, newRating) => setRating(newRating)}
            valueLabelDisplay="auto"
            min={0}
            max={5}
            step={0.5}
            sx={{ color: 'tomato' }}
          />
        </div>
      </div>

      {/* Product Cards OR Loader */}
      <div className="w-full md:w-3/4">
        {loading ? (
          <div className="w-full h-[60vh] flex justify-center items-center bg-white rounded shadow">
            <div className="w-[10vmax] h-[10vmax] border-b-[5px] border-gray-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p className="text-gray-600 sm:text-xl text-md">No Products Found</p>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Pagination */}
    {!loading && resultPerPage < productsCount && (
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
      </div>
    )}
  </div>
</Fragment>

  );
};

export default Products;
