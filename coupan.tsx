const CouponsItem = ({ discount, code }: any) => {

    const [showCopyMessage, setShowCopyMessage] = useState(false)
  
    const handleCopyCode = () => {
        setShowCopyMessage(true)
  
        setTimeout(() => {
          setShowCopyMessage(false)
        }, 2000)
    }
  
    useEffect(() => {
        return () => {
          setShowCopyMessage(false)
        }
    },[])
  
    return (
  
      <div className="flex gap-2 h-44 border border-gray-500  rounded-lg shadow-cart hover:border-blue-400 hover:shadow-popup transition-all duration-75">
         <div className="w-[40%] border-r-2 border-gray-400 flex items-center justify-center  
         bg-gradient-to-r from-pink-600 to-white rounded-r-3xl">
          <p className="text-4xl font-segoe font-semibold text-black flex items-end gap-x-0.5">
            <span>{discount}</span>
            <span className="text-xl">%</span>
          </p>
          {/* <RiCouponLine size={120}/> */}
          {/* <img src="https://m.media-amazon.com/images/I/71oyEZZW8+L._AC_UF1000,1000_QL80_.jpg" className="w-24"/> */}
          </div>
  
          <div className="w-[60%]  relative flex flex-col gap-2 px-2 py-1">
  
            <p className="text-md m-0 font-segoe font-semibold text-heading">
                Coupon
            </p>
            <p className="text-sm m-0 font-segoe font-normal text-heading">
            Get upto {discount}% discount
            </p>
            <div className="flex gap-2">
  
            <p className="text-sm m-0 font-segoe flex gap-1 font-semibold text-black cursor-pointer w-min bg-gray-300 px-2 rounded-lg ">
          <span>
            Code:
            </span>  
            <span>{code}</span>
            </p>
            {
              !showCopyMessage && (
                <MdContentCopy className=" cursor-pointer active:scale-95 transition-all" onClick={handleCopyCode}/>
              )
            }
            {
              showCopyMessage && (
                <p className="m-0 text-xs font-semibold font-segoe text-green-700">Copied!</p>
              )
            }
            </div>
  
            <p className="m-0 absolute font-semibold px-1  bg-red-200 top-0 right-0 text-xs text-red-800 flex gap-1 rounded-tr-lg rounded-bl-lg ">
            <FaRegClock  /> 3d
            </p>
          </div>
  
         
      </div>
      // <div className="flex justify-center items-center w-52 h-20 zigzag flex-col gap-1 ">
      //   <p className="m-0 font-segoe font-semibold text-white ">
      //     Get upto {discount}% discount
      //   </p>
      //   <p className="m-0 font-segoe font-semibold text-white text-xs">
      //     <span className="font-bold">Code:</span>{" "}
      //     <span className="px-2 py-0.5 rounded-2xl bg-black">{code}</span>
      //   </p>
      // </div>
    );
  };



  <div className='flex pt-28'>
  <div className="flex flex-col gap-4 mr-4 sticky top-12">
    {product && product.images.map((item) => (
      <img
        src={item.url}
        className="w-[40px] h-[40px] border-[0.7px] border-gray-700 rounded-lg hover:shadow-image focus:shadow-image active:shadow-image"
        onClick={() => setProductImage(item)}
      />
    ))}
  </div>
  <div className="block lg:flex pt-3 pb-5 items-start gap-24">
    <div className="lg:hidden">
      <Carousel showStatus={false} showArrows={true} infiniteLoop={false} showThumbs={true}>
        {product.images && product.images.map((item, i) => (
          <img
            className='CarouselImage'
            style={{ position: 'relative' }}
            key={item.url}
            src={item.url}
            alt={`${i} slide`}
          />
        ))}
      </Carousel>
    </div>
    <div className="hidden lg:flex flex-col gap-2.5 lg:sticky top-12 w-[400px]">
      <div onClick={() => setPopup(true)}>
        <div className='flex'>
          <CustomImageMagnifier src={productImage?.url} alt="productImage" />
        </div>
      </div>
      {popup && (
        <div className="transition-all duration-300 ease-in-out opacity-100">
          <ProductPopup
            setPopup={setPopup}
            productImage={productImage}
            product={product}
            setProductImage={setProductImage}
          />
        </div>
      )}
    </div>
  </div>
  </div>