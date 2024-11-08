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

const Home = () => {
  const { loading, error, products } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  // const [shuffledProducts, setShuffledProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [productsPerPage, setProductsPerPage] = useState(4);

  const productRefs = useRef([]);
  const updateProductsPerPage = debounce(() => {
    if (window.innerWidth <= 700) {
      setProductsPerPage(4);
    } else {
      setProductsPerPage(5);
    }
  }, 300);

  const handleNext = () => {
    if (shuffledProducts && currentPage < shuffledProducts?.length - productsPerPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      productRefs.current[nextPage]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      productRefs.current[prevPage]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

// Fisher-Yates Shuffle Algorithm
const shuffleArray = (array) => {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // Swap it with the current element
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};
  useEffect(() => {
    if (error) {
      console.error('Error fetching products:', error);
      return toast.error(error.message);
    }

    dispatch(getProduct());
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
          <main className="flex flex-col pt-20 bg-[#f1f2f4]">
            <Categories />
            <Banner />

            <div className="bg-[#f1f2f4] px-3 py-4">
              <div className="bg-white group rounded-md">
                <h2 className="homeHeading mx-auto pt-8 mb-7 md:pt-10 md:mb-10">Featured Products</h2>
                <div className="flex mx-auto w-[99%] justify-center max-w-full h-[60vh]">
                  <div className="my-auto lg:mt-36">
                    <button
                      onClick={handlePrev}
                      className="left-0 absolute bg-[#f1f2f4] md:p-6 p-3 h-20 sm:h-16 md:h-28"
                      disabled={currentPage === 0}
                    >
                      <FaChevronLeft />
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-center">
                    {shuffledProducts &&
                      shuffledProducts
                        .slice(currentPage, currentPage + productsPerPage)
                        .map((product, index) => (
                          <div
                            key={product._id}
                            ref={(el) => (productRefs.current[index + currentPage] = el)}
                          >
                            <ProductCard product={product} />
                          </div>
                        ))}
                  </div>
                  <div className="my-auto lg:mt-36 ">
                    <button
                      onClick={handleNext}
                      className="absolute right-0 bg-[#f1f2f4] md:p-6 p-3 h-20 sm:h-16 md:h-28"
                      disabled={shuffledProducts && currentPage >= shuffledProducts.length - productsPerPage}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 w-[99%] h-[100px] lg:h-[200px] rounded-md mx-auto flex flex-col px-10 py-2">
              <p className="text-xl lg:text-5xl font-bold my-2 lg:my-4">Connect with us!</p>
              <p className="text-sm lg:text-lg font-medium">Open for 24 X 7 customer support</p>
            </div>

            <div className="pt-5 w-[99%] mx-auto bg-white mt-4 rounded-md">
              <h2 className="homeHeading mx-auto pt-8 mb-7 md:pt-10 md:mb-10">Best Sellers</h2>

              <div className="flex mx-auto w-[99%] justify-center max-w-full h-[60vh] flex-wrap">
                {shuffledProducts &&
                  shuffledProducts.slice(4).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
              </div>
            </div>

            <div className="bg-green-200 w-[99%] h-[100px] lg:h-[200px] rounded-md mx-auto flex flex-col px-10 py-2 my-2">
              <p className="text-xl lg:text-5xl font-bold my-2 lg:my-4">Discover More, Pay Less!</p>
              <Link className="text-sm lg:text-lg font-medium hover:underline underline-offset-1" to="/products">
                explore more
              </Link>
            </div>
          </main>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
