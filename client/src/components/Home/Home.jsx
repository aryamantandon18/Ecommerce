import React, { Fragment, useEffect, useState, useRef } from 'react';
import MetaData from '../layouts/MetaData.js';
import { ProductCard } from './ProductCard';
import { useDispatch, useSelector} from 'react-redux';
import Loader from '../layouts/loader/Loader.jsx';
import toast from 'react-hot-toast';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Banner from './Banner/Banner.jsx';
import Categories from './Categories.jsx';
import debounce from 'lodash/debounce';
import { Link } from 'react-router-dom';
import { motion , useScroll} from 'framer-motion';
import axios from 'axios';
import { server } from '../../index.js';
import Carousel from './carousel/Carousel.jsx';
import { getFeaturedProducts } from '../../actions/productActions.js';
import { CLEAR_ERRORS } from '../../constants/productConstants.js';
import "../layouts/loader/loader.css"

const Home = () => {
  // const { loading } = useSelector((state) => state.products);
  // const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(4);
  const [sliceEnd,setSliceEnd] = useState(9);
  const {scrollYProgress} = useScroll();

  const dispatch = useDispatch();
  const {loading,featuredProducts,error} = useSelector((state) => state.featuredProducts);

  const productRefs = useRef([]);
  const updateProductsPerPage = debounce(() => {
    setProductsPerPage(window.innerWidth <= 700 ? 4 : 5);
    setSliceEnd(window.innerWidth <= 700 ? 8 : 9);
  }, 300);

  const handleNext = () => {
    if (currentPage < featuredProducts.length - productsPerPage) {
      setCurrentPage((prevPage) => prevPage + 1);
      productRefs.current[currentPage + 1]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
      productRefs.current[currentPage - 1]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // const fetchFeaturedProducts = async () => {
  //   try {
  //     const { data } = await axios.get(`${server}/products/featuredProducts`);
  //     setFeaturedProducts(data.products);
  //   } catch (error) {
  //     toast.error(error.response?.data.message || "Could not fetch featured products.");
  //   }
  // };
  
  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);

  useEffect(()=>{
    if(error){
      toast.error(error);
    }
    dispatch({type:CLEAR_ERRORS})
  },[error])

  useEffect(() => {
    updateProductsPerPage();
    window.addEventListener('resize', updateProductsPerPage);
    return () => window.removeEventListener('resize', updateProductsPerPage);
  }, []);

  return (
    <Fragment>
      {/* {loading ? (
        <Loader />
      ) : ( */}
        <Fragment>
          <MetaData title="ShopBazar" />
          <motion.main
            className="flex flex-col pt-16 md:pt-20 bg-[#f1f2f4] overflow-x-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
            style={{
              scaleX:scrollYProgress,
            }}
            className="bg-slate-400 w-full h-2 fixed left-0 top-[70px] z-10 rounded-md">
              
            </motion.div>
            <Categories />
            <Banner />

            {/* Featured Products Section */}
            <motion.div className="bg-[#f1f2f4] px-3 py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="bg-white group rounded-md">
                <h2 className="text-center text-[1.4vmax] border-b-2 border-gray-400 w-[20vmax] font-roboto mx-auto pt-8 pb-2 mb-7 md:pt-10 md:mb-10">Featured Products</h2>
                {loading ? (
                        <div className="w-full py-10 h-[60vh] flex justify-center items-center bg-white">
  <div className="w-[8vmax] h-[8vmax] border-b-[5px] border-gray-600 rounded-full animate-spin" />
</div>
                ):(
                  <div className={`flex mx-auto w-[99%] justify-center max-w-full h-[60vh]`}>
                  <div className="my-auto lg:mt-36 cursor-pointer hover:font-bold">
                    <button
                      onClick={handlePrev}
                      className="left-0 absolute bg-[#f1f2f4] md:p-6 p-3 h-20 sm:h-16 md:h-28"
                      disabled={currentPage === 0}
                    >
                      <FaChevronLeft />
                    </button>
                  </div>

                  <div className="flex flex-wrap justify-center sm:space-x-2">
                    {featuredProducts?.slice(currentPage, currentPage + productsPerPage).map((product, index) => (
                      <motion.div
                        key={product._id}
                        ref={(el) => (productRefs.current[index + currentPage] = el)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </div>

                  <div className="my-auto lg:mt-36 hover:font-bold cursor-pointer">
                    <button
                      onClick={handleNext}
                      className="absolute right-0 bg-[#f1f2f4] md:p-6 p-3 h-20 sm:h-16 md:h-28"
                      disabled={currentPage >= featuredProducts?.length - productsPerPage}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
                )}
              </div>
            </motion.div>

            <motion.div
              className="bg-blue-100 w-[99%] h-[100px] lg:h-[200px] rounded-md mx-auto flex flex-col px-10 py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-xl lg:text-5xl font-bold my-2 lg:my-4">Connect with us!</p>
              <p className="text-sm lg:text-lg font-medium">Open for 24 X 7 customer support</p>
            </motion.div>
            
            {/* Best Sellers Section */}
            <motion.div className="pt-5 w-[99%] mx-auto max-w-full bg-white mt-4 rounded-md">
              <h2 className="text-center text-[1.4vmax] border-b-2 border-gray-400 w-[20vmax] font-roboto mx-auto pt-8 pb-2 mb-7 md:pt-10 md:mb-10">Best Sellers</h2>
              {loading?(    <div className="w-full py-10 h-[60vh] flex justify-center items-center bg-white">
  <div className="w-[8vmax] h-[8vmax] border-b-[5px] border-gray-600 rounded-full animate-spin" />
</div>):(
                <div className="flex mx-auto justify-center sm:w-[100%] w-[90%] h-[60vh] flex-wrap sm:space-x-2">
                {featuredProducts?.slice(4,sliceEnd).map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
                </div>
              )}
            </motion.div>

            <Carousel/>

            <motion.div className="pt-5 w-[99%] mx-auto max-w-full bg-white mt-4 rounded-md">
            
              <div className="flex mx-auto justify-center sm:w-[100%] w-[90%] h-[60vh] flex-wrap sm:space-x-2 items-center">
                {featuredProducts?.slice(4,sliceEnd).map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-green-200 w-[99%] h-[100px] lg:h-[200px] rounded-md mx-auto flex flex-col px-10 py-2 my-2 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <p className="text-xl lg:text-5xl font-bold my-2 lg:my-4">Discover More, Pay Less!</p>
              <Link className="text-sm lg:text-lg font-medium hover:underline underline-offset-1" to="/products">
                explore more
              </Link>
            </motion.div>


                
          </motion.main>
        </Fragment>
      {/* )} */}
    </Fragment>
  );
};

export default Home;
