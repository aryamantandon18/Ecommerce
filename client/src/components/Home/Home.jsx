import React, { Fragment, useEffect, useState, useRef } from 'react';
import MetaData from '../layouts/MetaData.js';
import { ProductCard } from './ProductCard';
import './Home.scss';
import { getProduct } from '../../actions/productActions.js';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../layouts/loader/Loader.jsx';
import toast from 'react-hot-toast';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Banner from './Banner/Banner.jsx';
import Categories from './Categories.jsx';
import debounce from 'lodash/debounce';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const { loading, error, products } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(4);

  const productRefs = useRef([]);
  const updateProductsPerPage = debounce(() => {
    setProductsPerPage(window.innerWidth <= 700 ? 4 : 5);
  }, 300);

  const handleNext = () => {
    if (currentPage < shuffledProducts?.length - productsPerPage) {
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

  const shuffleArray = (array) => {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    } else {
      dispatch(getProduct());
    }
  }, [dispatch, error]);

  useEffect(() => {
    updateProductsPerPage();
    window.addEventListener('resize', updateProductsPerPage);
    return () => window.removeEventListener('resize', updateProductsPerPage);
  }, []);

  const shuffledProducts = products ? shuffleArray(products.slice()) : [];

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="ECOMMERCE" />
          <motion.main
            className="flex flex-col pt-16 md:pt-20 bg-[#f1f2f4]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6}}
          >
            <Categories />
            <Banner />

            <motion.div className="bg-[#f1f2f4] px-3 py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="bg-white group rounded-md">
                <h2 className="homeHeading mx-auto pt-8 mb-7 md:pt-10 md:mb-10">Featured Products</h2>
                <div className="flex mx-auto w-[99%] justify-center max-w-full h-[60vh]">
                  <motion.div whileHover={{ scale: 1.1 }} className="my-auto lg:mt-36">
                    <button
                      onClick={handlePrev}
                      className="left-0 absolute bg-[#f1f2f4] md:p-6 p-3 h-20 sm:h-16 md:h-28"
                      disabled={currentPage === 0}
                    >
                      <FaChevronLeft />
                    </button>
                  </motion.div>

                  <div className="flex flex-wrap justify-center">
                    {shuffledProducts.slice(currentPage, currentPage + productsPerPage).map((product, index) => (
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

                  <motion.div whileHover={{ scale: 1.1 }} className="my-auto lg:mt-36">
                    <button
                      onClick={handleNext}
                      className="absolute right-0 bg-[#f1f2f4] md:p-6 p-3 h-20 sm:h-16 md:h-28"
                      disabled={currentPage >= shuffledProducts.length - productsPerPage}
                    >
                      <FaChevronRight />
                    </button>
                  </motion.div>
                </div>
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

            <motion.div className="pt-5 w-[99%] mx-auto bg-white mt-4 rounded-md">
              <h2 className="homeHeading mx-auto pt-8 mb-7 md:pt-10 md:mb-10">Best Sellers</h2>
              <div className="flex mx-auto w-[99%] justify-center max-w-full h-[60vh] flex-wrap">
                {shuffledProducts.slice(4).map((product) => (
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
              className="bg-green-200 w-[99%] h-[100px] lg:h-[200px] rounded-md mx-auto flex flex-col px-10 py-2 my-2"
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
      )}
    </Fragment>
  );
};

export default Home;
