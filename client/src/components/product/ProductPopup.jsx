import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';

const ProductPopup = ({ setPopup, productImage, product }) => {
  const [productMedia, setProductMedia] = useState({ type: 'image', url: productImage?.url });
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('images');

  const toggleZoom = () => {
    if (productMedia.type === 'image') {
      setIsZoomed(!isZoomed);
    }
  };

  const handleMouseMove = (e) => {
    if (!isZoomed || productMedia.type === 'video') return;
    const { movementY } = e.nativeEvent;
    e.currentTarget.scrollTop += movementY * 1.2;
  };

  const handleVideoClick = (videoObj) => {
    setProductMedia({ type: 'video', url: videoObj?.src });
  };

  const handleVideoPlayToggle = (e) => {
    if (e.target.paused) {
      e.target.play();
    } else {
      e.target.pause();
    }
  };

  return (
    <div className='fixed inset-0 bg-opacity-30 backdrop-blur-sm text-black z-60 mt-20 flex items-center justify-center'>
      <div className='w-[80%] h-[80%] bg-white shadow-popup px-4 py-6 rounded-lg z-50 flex flex-col' style={{ boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}>
        <div className='mx-4 h-[8%] relative border-b-2 border-[#e7e7e7] flex justify-between'>
          <div className='font-medium flex gap-3 mt-2'>
            <p className={`cursor-pointer ${activeTab === 'images' ? 'border-b-2 border-red-400' : 'border-transparent'}`} onClick={() => setActiveTab('images')}>
              Images
            </p>
            <p className={`cursor-pointer ${activeTab === 'videos' ? 'border-b-2 border-red-400' : 'border-transparent'}`} onClick={() => setActiveTab('videos')}>
              Videos
            </p>
          </div>
          <IoMdClose onClick={() => setPopup(false)} className='border-2 border-blue-400 rounded-md hover:bg-blue-100 cursor-pointer text-2xl font-semibold shadow-md my-auto' />
        </div>

        <div className='flex gap-2 mt-2 w-full h-full overflow-hidden'>
          <div className='relative w-[80%] h-full flex items-center justify-center' onMouseMove={handleMouseMove}>
            {productMedia.type === 'image' ? (
              <img
                src={productMedia.url}
                className={`max-w-[80%] max-h-[100%] object-contain transition-transform duration-300 ${isZoomed ? 'scale-[2] cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
                alt='Product'
                onClick={toggleZoom}
              />
            ) : (
              <video src={productMedia.url} className='max-w-[80%] max-h-[100%] cursor-pointer' controls onClick={handleVideoPlayToggle} />
            )}
          </div>

          <div className='flex flex-col gap-3 w-[30%] pl-8 border-l-2 border-[#e7e7e7]'>
            <div className='mt-8 text-2xl font-semibold'>{product?.name}</div>
            <p className='mb-2 text-lg text-gray-700'>{product?.description}</p>

            {activeTab === 'images' && (
              <div className='flex flex-wrap gap-4 mt-4'>
                {product?.images.map((imageObj) => (
                  <img
                    key={imageObj.url}
                    src={imageObj.url}
                    className={`w-[60px] h-[60px] border-[0.7px] rounded-lg cursor-pointer hover:shadow-lg ${imageObj.url === productMedia.url ? 'shadow-lg border-red-400' : 'border-gray-700'}`}
                    onClick={() => setProductMedia({ type: 'image', url: imageObj.url })}
                  />
                ))}
              </div>
            )}

            {activeTab === 'videos' && (
              <div className='flex flex-wrap gap-4 mt-4'>
                {product?.videos.map((videoObj, index) => (
                  <video key={index} className='w-[60px] h-[60px] cursor-pointer rounded-lg border-[0.7px] hover:shadow-lg' onClick={() => handleVideoClick(videoObj)}>
                    <source src={videoObj?.src} type='video/mp4' />
                  </video>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPopup;
