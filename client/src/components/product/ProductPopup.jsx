import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const ProductPopup = ({ setPopup, productImage, product }) => {
  const [productImg, setProductImg] = useState(productImage);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('images'); // State to track active tab

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e) => {
    const imageContainer = e.currentTarget;
    const scrollSpeed = 1; // Adjust scroll speed as needed

    if (!isZoomed) return; // Only scroll when zoomed in

    // Calculate the direction of mouse movement
    const deltaY = e.nativeEvent.movementY;

    // Scroll the image container
    imageContainer.scrollTop += deltaY * scrollSpeed;
  };

  return (
    <div className='fixed inset-0 bg-opacity-30 backdrop-blur-sm text-black scroll-smooth z-60 mt-20'>
      <div className='m-auto flex flex-col gap-3 my-20 w-[80%] h-[80%] bg-white shadow-popup px-4 py-6 rounded-lg z-50' style={{boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"}}>
        <div className='mx-4 h-[8%] relative border-b-2 border-[#e7e7e7] flex justify-between'>
          <div className='font-medium flex gap-3 mt-2'>
            <p
              className={`h-[100%] bg-white border-b-2 cursor-pointer ${activeTab === 'images' ? 'border-red-400' : 'border-transparent'}`}
              onClick={() => setActiveTab('images')}
            >
              Images
            </p>
            <p
              className={`h-[100%] bg-white border-b-2 cursor-pointer ${activeTab === 'videos' ? 'border-red-400' : 'border-transparent'}`}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </p>
          </div>
          <IoMdClose
            onClick={() => setPopup(false)}
            className='border-2 border-blue-400 rounded-md hover:bg-blue-100 cursor-pointer text-2xl font-semibold shadow-md my-auto'
          />
        </div>
        <div className='flex gap-2 mt-2 w-[100%] h-[100%] overflow-auto'>
          <div className='relative w-[80%] h-[100%] grid place-items-center' onMouseMove={handleMouseMove}>
            <img
              src={productImg?.url}
              className={` max-w-80 max-h-100 scale-150 object-contain transition-transform duration-300 ${isZoomed ? 'scale-300 ' : 'scale-100'}`}
              alt='Product'
              onClick={toggleZoom}
              style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
            />
          </div>
          <div className='flex flex-col gap-3 w-[30%] pl-8 border-l-2 border-[#e7e7e7]'>
            <div className='mt-8'>{product?.name}</div>
            {activeTab === 'images' && (
              <div className='flex flex-row gap-4 mt-4 mr-4'>
                {product &&
                  product.images.map((imageObj) => (
                    <img
                      key={imageObj.url}
                      src={imageObj.url}
                      className={`w-[40px] h-[40px] border-[0.7px] rounded-lg cursor-pointer hover:shadow-image ${
                        imageObj.url === productImg?.url ? 'shadow-image' : 'border-gray-700'
                      }`}
                      onClick={() => setProductImg(imageObj)}
                    />
                  ))}
              </div>
            )}
            {activeTab === 'videos' && (
              <div className='flex flex-row gap-4 mt-4 mr-4'>
                {/* Add video thumbnails or video components here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPopup;
