import React, { Fragment, useEffect, useState, useRef, startTransition } from 'react';
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

const Home = () => {
  const { loading, error, products } = useSelector((state) => state.products);
  const dispatch = useDispatch();
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
    if (currentPage < products.length - productsPerPage) {
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

  useEffect(() => {
    if (error) {
      console.error("Error fetching products:", error);
      return toast.error(error.message);
    }
    dispatch(getProduct());
    updateProductsPerPage();
    window.addEventListener('resize', updateProductsPerPage);
    return () => window.removeEventListener('resize', updateProductsPerPage);
  }, [dispatch, error]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="ECOMMERCE" />
          <main className="flex flex-col pt-20">
            <Categories />
            <Banner />

            <div className="bg-[#f1f2f4] px-3 py-4">
              <div className="bg-white group">
                <h2 className="homeHeading mx-auto pt-8 mb-7 md:pt-10 md:mb-10">Featured Products</h2>
                <div className="flex mx-auto w-[99%] justify-center max-w-full h-[60vh]">
                  <div className="my-auto lg:mt-36 hidden group-hover:block">
                    <button
                      onClick={handlePrev}
                      className="left-0 absolute bg-[#f1f2f4] md:p-6 p-3 h-20 sm:h-16 md:h-28"
                      disabled={currentPage === 0}
                    >
                      <FaChevronLeft />
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-center">
                    {products &&
                      products
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
                  <div className="my-auto lg:mt-36 hidden group-hover:block">
                    <button
                      onClick={handleNext}
                      className="absolute right-0 bg-[#f1f2f4] md:p-6 p-3 h-20 sm:h-16 md:h-28"
                      disabled={currentPage >= products.length - productsPerPage}
                    >
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <h2 className="homeHeading mx-auto pt-8 mb-7 md:pt-10 md:mb-10">Best Sellers</h2>

              <div className="flex mx-auto w-[99%] justify-center max-w-full h-[60vh] flex-wrap">
                {products &&
                  products.slice(4).map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
              </div>
            </div>
          </main>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
