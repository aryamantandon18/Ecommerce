/* eslint-disable import/no-unresolved */

import React, { useEffect, useState } from "react";
import Button from "@components/ui/button";
import { useRouter } from "next/router";
import { ProductAttributes } from "./product-attributes";
import { SwiperSlide } from "swiper/react";
import { ROUTES } from "@utils/routes";
import { calculateDiscountedPrice } from "@utils/designer/product-price-utils";
import { useTranslation } from "next-i18next";
import ProductQuantityCounter from "./product-quantity-counter";
import { useCart } from "@contexts/cart/cart.context";
import { createCombination } from "@utils/designer/combinations-utils";
import { generateCartObjectFromDesignerState } from "@utils/cart/generate-cart-object";
import {
  addCombinationsToCart,
  generateCart,
  getAllProducts,
} from "src/api/backend/public";
import notify from "@utils/notify";
import { NextSeo } from "next-seo";
import { siteSettings } from "@settings/site-settings";
import getProductFrontImageObj from "@utils/designer/get-product-front-image";
import ProductReviewCard from "./product-review-card";
import ReactStars from "react-rating-stars-component";
import ProductReviewsModal from "./product-reviews-modal";
import ProductAdditionalDetails from "./product-additional-details";
// import Carousel from "@components/ui/carousel/carousel";
import { useSelector, useDispatch } from "react-redux";
import { setFinalPrice, setQuantity } from "../../redux/actions";
import StickyBox from "react-sticky-box";

import ProductImageDetail from "./product-image-datail";
import ProductImage from "./product-image";
import CashFreePayments from "@components/cashfree/cashFreePayments";
import SamplePaymentForm from "@components/checkout/sample-payment-form";
import PaymentForm from "@components/checkout/payment-form";
import { AppDispatch, RootState } from "src/redux/store";
import RangeSlider from "@components/Rangeslider/Range";
import ProductDescription from "./productDescription";
import ProductDetailBtn from "./productDetailButton";
import ProductSlider from "./productSlider";
import { IoPricetagOutline } from "react-icons/io5";
import ProductTags from "./product-tags";
import ProductBasicInfo from "./product-basic-info";
import tshirtImage from "../../../public/assets/images/products/white-tshirt.png";
import ProductRecommendation from "./product-recommendation";
import Link from "next/link";
import ReviewCount from "./review-count";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ProductPopup from "./product-popup";

const productDemo = [
  {
    name: "T-shirt",
    src: "",
  },
  {
    name: "Hoodie",
    src: "",
  },
  {
    name: "Full T-shirt",
    src: "",
  },
];
const demoImages = [
  {url: "/assets/images/newsletter.jpg"},
  {url: "/assets/images/products/p-4-m.png"},
  {url: "/assets/images/products/p-5-m.png"},
  {url: "/assets/images/newsletter.jpg"},
  {url: "/assets/images/newsletter.jpg"},
  {url: "/assets/images/newsletter.jpg"},
]

interface Props {
  product: any;
  addresses: any;
  activeAddress: any;
  setActiveAddress: any;
  paymentIntentId: any;
  shippingCostObj: any;
  taxCostObj: any;
}

const productGalleryCarouselResponsive = {
  "768": {
    slidesPerView: 2,
  },
  "0": {
    slidesPerView: 1,
  },
};

const addToCartSuccessMessage = "Added your item to the cart successfully.";
const addToCartErrorMessage =
  "An error happened while adding your item to the cart.";

const ProductSingleDetails: React.FC<Props> = ({
  product,
  addresses,
  activeAddress,
  setActiveAddress,
  shippingCostObj,
  paymentIntentId,
  taxCostObj,
}) => {
  const [productImage,setProductImage] = useState(product && product.images[0]);
  const router: any = useRouter();
  const { slug } = router.query;
  const { _id: cartId, totalItems: cartTotalItems, setCartState } = useCart();
  const { t } = useTranslation("common");

  console.log(cartId, "cartID")
  console.log("Line 106 in product-single-details",product);
  // console.log("Line 106 in product-single-details",product.attributes);
  const [selectedColor, setSelectedColor] = useState<string>(product.attributes.Color[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?product.sizes[0]:0);
  const [selectedQuantity, setSelectedQuantity] = useState(
    product.minimumQuantity
  );
  const [selectDecoration, setSelectedDecoration] = useState(
    product.decorations
  );
  const [isResetOption, setIsResetOption] = useState(false);
  const [isCrousel, setIsCrousel] = useState(true);

  // show slider buttons
  const [showSample, setShowSample] = useState(true);
  const [showDemo, setShowDemo] = useState(true);
  const [showBulk, setShowBulk] = useState(true);

  // Manage the retail flow and bulk flow
  const [isRetail, setIsRetail] = useState(false);

  // floating footer
  const [isVisible, setIsVisible] = useState(false);

  // add to cart button loader.
  const [btnLoading, setBtnLoading] = useState(false);

  const [skipDesign, setSkipDesign] = useState(false);

  // reviews modal
  const [reviewsModalOpen, setReviewsModal] = useState(false);

  const [activeImg, setActiveImage] = useState<string>(
    product.images[0]?.src || ""
  );
  const [activeImgBorder, setActiveImageBorder] = useState(true);
  const [showSampleButton, setshowSampleButton] = useState(true);
  const [isSample, setIsSample] = useState(true);
  const [amt, setAmt] = useState(product.unitPrice);
  const [samplebtn, setSampleBtn] = useState("sample");
  const [quantityTitle, setQuantityTitle] = useState("Quantity");
  const [isFixedImage, setIsFixedImage] = useState(false);

  const [customValue, setCustomValue] = useState<any>(1);
  const dispatch: AppDispatch = useDispatch();
  const [activeProduct, setActiveProduct] = useState(false);
  const [activeProductName, setActiveProductName] = useState<string>(
    productDemo[0].name
  );
  const [relatedProduct, setRelatedProduct] = useState<any>();
  const [allProducts, setAllProducts] = useState<any>();
  const [popup,setPopup] = useState<boolean>(false);

  // const {} = useCart()

  const AllProducts = async () => {
    try {
      const { data }: any = await getAllProducts();
      if (!data) {
        console.log("Products not found");
      }

      setAllProducts(data);
    } catch (error) {
      console.log("error while fetching products in product detail page");
    }
  };

  console.log(allProducts, "allProducts");

  useEffect(() => {
    const filteredProducts: any = allProducts?.filter(
      (i: any) => i?.categories[0]?.name === product?.categories[0]?.name
    );
    setRelatedProduct(filteredProducts);
  }, [allProducts]);

  useEffect(() => {
    AllProducts();
  }, []);

  console.log(relatedProduct, "relatedProduct");

  // image position while scroll handler
  // useEffect(()=> {
  //   const handleScroll = () => {
  //     if (window.scrollY >= 50) {
  //       setIsFixedImage(true)
  //     }else if (window.scrollY > 600) {
  //       setIsFixedImage(false)
  //     }
  //   }

  //   window.addEventListener('scroll', handleScroll);

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   }
  // },[])

  console.log(product, "productsss");

  useEffect(() => {
    setSelectedDecoration("default");
  }, [isResetOption]);

  // footer visibility handle
  console.log(selectedQuantity, "TotalQ");
  useEffect(() => {
    dispatch(setQuantity(customValue));
  }, [customValue]);
  console.log(customValue, "cust");

  // useEffect(() => {
  //   let prevScrollY = window.scrollY;

  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY;
  //     if (currentScrollY > prevScrollY) {
  //       setIsVisible(true);
  //     } else {
  //       setIsVisible(false);
  //     }
  //     prevScrollY = currentScrollY;
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   // clean up the event listener
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  useEffect(() => {
    const handleScrolls = () => {
      console.log("Scrolling...");
      const scrollTop = window.scrollY;
      console.log("Scroll top", scrollTop);
      const lastSection = document.getElementById("detail");
      console.log("last", lastSection?.offsetTop);

      if (lastSection && scrollTop >= lastSection.offsetHeight) {
        setIsFixedImage(false);
      } else {
        setIsFixedImage(true);
      }
    };

    window.addEventListener("scroll", handleScrolls);

    return () => {
      window.removeEventListener("scroll", handleScrolls);
    };
  }, []);

  useEffect(() => {
    // console.log('pricing');
    if (samplebtn === "sample") {
      setAmt(product.unitPrice * customValue);
    }
    // if (showSampleButton && samplebtn === "bulk") {
    //   setAmt(product.unitPrice * customValue);
    // }
    // else if (samplebtn === "bulk") {
    //   setAmt(product.unitPrice * customValue);
    // }
    // else {
    //   // if(customValue>=product.tieredPricing.min && customValue<=product.tieredPricing.max){
    //   // if (product.tieredPricing && customValue >=product.tieredPricing.min  && customValue <= product.tieredPricing.max && router.query?.sampleCost) {
    //   //   setAmt(product.tieredPricing[0].finalprice * customValue - router.query?.sampleCost);
    //   // }
    //   // else if (product.tieredPricing && customValue >= 10 && customValue <= 23) {
    //   //   setAmt(product.tieredPricing[0].finalprice * customValue);
    //   // }
    //   if (product.tieredPricing && customValue >=val.min  && customValue <= val.max && router.query?.sampleCost) {
    //     setAmt(val.finalprice * customValue - router.query?.sampleCost);
    //   }
    //   else if (product.tieredPricing && customValue >= val.min && customValue <= val.max) {
    //     setAmt(val.finalprice * customValue);
    //   }
    //   else {
    //     setAmt(product.unitPrice * customValue)
    //   }
    // }
    // }
    // setAmount()
  }, [customValue]);

  const setAmount = (val: any) => {
    if (showSampleButton && samplebtn === "sample") {
      setAmt(product.unitPrice * customValue);
    } else if (samplebtn === "sample") {
      setAmt(product.unitPrice * customValue);
    } else {
      if (product.tieredPricing && router.query?.sampleCost) {
        setAmt(val.finalprice * customValue - router.query?.sampleCost);
      } else if (product.tieredPricing) {
        setAmt(val.finalprice * val.max);
      } else {
        setAmt(val.finalPrice * val.max);
      }
    }
  };

  useEffect(() => {
    setAmt(customValue * product.unitPrice);
  }, [customValue]);

  const handleImageClick = (newSrc: string) => {
    setActiveImage(newSrc);
    setActiveImageBorder(true);
  };
  useEffect(() => {
    if (router.query.sample === "true") {
      setshowSampleButton(false);
    }
  }, []);

  function toggleReviewsModal() {
    setReviewsModal((v) => !v);
  }

  function closeReviewsModal() {
    setReviewsModal(false);
  }

  function handleGoToDesigner() {
    let url;
    if (router?.query?.convertToOrder === "true") {
      url = ROUTES.CHECKOUT + "?convertToBooking=true&orderId=&sampleCost=";
    } else {
      url = ROUTES.CHECKOUT;
    }
    !skipDesign
      ? router.push(url)
      : //router.push(ROUTES.DESIGNER + "/" + slug + "?quantity=" + customValue)
        null;
  }

  function handleContactSales() {
    router.push(ROUTES.CONTACT);
  }

  const storePrice = useSelector((state: RootState) => state.price.finalprice);

  const handleProductPrice = (val: any) => {
    dispatch(setFinalPrice(val.finalprice));
    console.log("finalprice", val, val.finalprice, "store: ", storePrice);
    console.log("store", storePrice);
    setAmount(val);
    setSelectedQuantity(val.max);
    setCustomValue(val.max);
  };

  // useEffect(()=>{
  //   handleProductPrice(parseInt(amt))
  //   console.log("amt", typeof amt)
  // },[customValue])

  const handleQuantity = (val: any) => {
    // dispatch(setFinalPrice(val.finalprice));
    setSelectedQuantity(val);
  };
  const handleChange = (e: any) => {
    setSampleBtn(e.target.value);
    // setRange(e.target.value)
    setQuantityTitle(e.target.value == !"bulk" ? "Custom Qty" : "Quantity");
    setIsSample(e.target.value === "bulk" ? false : true);
  };
  // useEffect(() => {
  //   samplebtn === 'sample' ? setCustomValue(4) : setCustomValue(10)
  // }, [handleChange])

  const handleAddToCart = async () => {
    setBtnLoading(true);
    console.log("issample", isSample);

    // create an initial combination
    let initialCombination = createCombination(product);

    // override the initial combination with the selected attributes.
    initialCombination.isSample = isSample;
    initialCombination.color = selectedColor;
    initialCombination.size = selectedSize;
    initialCombination.quantity = selectedQuantity;

    // create a combination cart obj or a complete cart obj depends if we have a cart or not.

    if (cartId && cartTotalItems > 0) {
      // we have an existent cart, must update it.

      let newCombinations: any = generateCartObjectFromDesignerState(
        [initialCombination],
        true
      );
      console.log("new comb", initialCombination);

      // call server
      let response: any = await addCombinationsToCart({
        cartId,
        combinations: newCombinations,
      });

      if (response.status !== 200) {
        // set loading to false
        // show error.
        notify({
          type: "error",
          message: addToCartErrorMessage,
        });
        setBtnLoading(false);
      } else {
        setCartState(response.data);
        // notify success.
        notify({
          type: "success",
          message: addToCartSuccessMessage,
        });
        setBtnLoading(false);
      }
    } else {
      // to create a complete cart with total price and total items.
      let cartObj = generateCartObjectFromDesignerState([initialCombination]);

      // call server
      let response = await generateCart(cartObj);

      if (response.status !== 200) {
        // set loading to false
        // show error.
        notify({
          type: "error",
          message: addToCartErrorMessage,
        });
        setBtnLoading(false);
      } else {
        setCartState(response.data);
        // notify success.
        notify({
          type: "success",
          message: addToCartSuccessMessage,
        });
        setBtnLoading(false);
      }
    }
  };

  const handleChangeProduct = (name: string) => {
    setActiveProduct(!activeProduct);
    setActiveProductName(name);
  };

  console.log(activeProduct, activeProductName, "demo");

  const handleClickOnTag = (tag: string) => {
    router.push(ROUTES.TAG + "/" + tag);
  };

  const handleClickCategories = (categorySlug: string) => {
    router.push(ROUTES.CATEGORY + "/" + categorySlug);
  };

  console.log(product?.tieredPricing, "product tiered");
  console.log(product?.images, "product");

  return (
    <>
      <div>
        {/* <footer
        className={`bg-white text-base text-black text-center border-t-4 border-gray-100 fixed inset-x-0 bottom-0 p-4 z-40 transform transition-transform ease-in-out duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-20"
        } `}
      > */}
        {/* <div className="flex justify-between items-center"> */}
        {/* <div className="text-heading font-bold"> */}
        {/* ${product.discount.amount
              ? calculateDiscountedPrice(product.unitPrice, product.discount)
              : product.unitPrice} */}
        {/* ${samplebtn == 'sample' ? amt * 3 : amt} */}
        {/* ${product.unitPrice * customValue} */}
        {/* <p className=" text-2xl">${amt}</p> */}
        {/* </div> */}
        {/* <div className="flex items-center gap-8"> */}
        {/* <ProductQuantityCounter
              // quantity={selectedQuantity}
              // setQuantity={setSelectedQuantity}
              quantity={customValue}
              setQuantity={setCustomValue}
              minimumQuantity={product.minimumQuantity}
            /> */}
        {(product.purchasableFromTheApp || !product.isDesignable) && (
          <></>
          
        )}
        {/* </div> */}
        {/* </div> */}
        {/* </footer> */}
      </div>

      <NextSeo
        additionalMetaTags={[
          { property: "keywords", content: product?.tags.join(", ") },
        ]}
        title={product?.seoTitle ? product.seoTitle : product.name}
        description={
          product?.seoDescription ? product.seoDescription : product.description
        }
        canonical={
          siteSettings.websiteUrl + ROUTES.PRODUCT + "/" + product.slug
        }
        openGraph={{
          url: siteSettings.websiteUrl + ROUTES.PRODUCT + "/" + product.slug,
          title: product?.seoTitle ? product.seoTitle : product.name,

          description: product?.seoDescription
            ? product.seoDescription
            : product.description,

          images: [
            {
              url: getProductFrontImageObj(product.images).src,
              width: 100,
              height: 140,
              alt: product?.seoTitle
                ? product.seoTitle + "-image"
                : product.name + "-image",
            },
          ],
        }}
      />
    {console.log("Line 559 ----------------------",product)}
      <div className="flex ">

      <div className="flex flex-col gap-4 mt-4 mr-4 sticky top-12">
      {product && product.images.map((imageObj: any)=>(
         <img src={imageObj.src} className="w-[40px] h-[40px] border-[0.7px] border-gray-700 rounded-lg hover:shadow-image focus:shadow-image active:shadow-image" 
         onClick={()=> setProductImage(imageObj)}
         />
      ))}
      </div>

      <div className="block lg:flex pt-3 pb-5 items-start gap-24 ">    
        {/* Mobile and ipad */}
        <div className="lg:hidden ">
                  <ProductImage
                    src={
                      productImage.src 
                    }
                    // src="/assets/images/products/white-tshirt.png"
                    imgBackgroundColor={
                      product.isDesignable ? selectedColor : "#FFFFFF"
                    }
                    alt={`${product.name}-${productImage.locale}`}
                    className="object-cover w-[90%] text-right"
                  />
                </div>
      
        <div
          className="hidden lg:flex flex-col gap-2.5 lg:sticky top-12 w-[400px] "
        >
        
            <div className=" " onClick={() => setPopup(true)}>
               <ProductImageDetail
                src={
                  productImage?.src 
                }
                imgBackgroundColor={
                  product?.isDesignable ? selectedColor : "#FFFFFF"
                }
                alt={`${product?.name}-${productImage?.locale}`}
                // className="  w-[350px] h-[450px] overflow-hidden"
              />
            </div>
            <div
    className={`transition-all duration-300 ease-in-out ${
      popup ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <ProductPopup
      setPopup={setPopup}
      productImage={productImage}
      product={product}
      setProductImage={setProductImage}
    />
  </div>
        </div>
{/* ----------------------------------------------------------------------------------------- */}
        <div className="w-full h-full ">
          <div className="pb-4 border-b border-gray-300 flex flex-col gap-1">
            <div className="flex gap-5 items-center">
              {
                <span className="text-sm font-semibold font-segoe">
                  {product?.categories[0]?.name}
                </span>
              }

              {product?.brandName ? (
                <ProductTags tagName={product?.brandName} isTag={true} />
              ) : (
                <ProductTags
                  tagName={"General"}
                  tagColor="gray-400"
                  isTag={true}
                />
              )}
            </div>
            <div className="flex leading-4 flex-row  w-full">
              <div className="w-1/2">
                <h2 className="text-heading flex justify-between text-xl m-0 p-0 font-bold ">
                  {product.name}
                </h2>
              </div>

              <div className="h-5 w-[50px] mt-1 flex flex-row gap-1 p-2 items-center justify-start  rounded-lg cursor-pointer bg-green-400 -z-10">
                <span className="font-semibold font-segoe text-xs text-white">
                  {product?.reviewsAverageRate || 0}
                </span>
                <Link href="#review" scroll={true}>
                  <ReactStars
                    count={1}
                    edit={false}
                    size={15}
                    color="#FFFFFF"
                    activeColor="#FFFFFF"
                    value={1}
                    isHalf={true}
                  />
                </Link>

                {/* <div className="border-l border-gray-300 flex items-center justify-center">
                    <span className=" pl-2 font-semibold font-segoe text-xs">126 Ratings</span>
                </div> */}
              </div>
              {/* <span className="text ms-1 text-base mt-1 font-bold text-heading">
                  ({product?.reviews?.length})
                </span> */}
            </div>
            <div className="flex flex-wrape gap-1">
              {product?.tags?.map((i: any) => (
                <ProductTags tagColor="blue-500" tagName={i} isTag={true} />
              ))}
              <ProductTags tagColor="blue-500" tagName="Summer" isTag={false} />
              <ProductTags tagName="Cotton" />
            </div>
            <p className="text-body text-xs leading-4 w-1/2">
              {product.description.slice(0, 80)}...
            </p>
            {/* <div className="h-5 w-[130px] flex flex-row gap-1 border border-gray-300 p-2 items-center justify-center">
                <span className="font-semibold font-segoe text-xs">4.4</span>
                <ReactStars
                  count={1}
                  edit={false}
                  size={15}
                  color="#41c392"
                  activeColor="#202020"
                  value={product?.reviewsAverageRate}
                  isHalf={true}
                />
                <div className="border-l border-gray-300 flex items-center justify-center">
                    <span className=" pl-2 font-semibold font-segoe text-xs">126 Ratings</span>
                </div>
              </div> */}
            {product.discount.amount ? (
              <div className="flex items-center">
                <div className="text-heading font-bold flex items-center gap-1 ">
                  <p className="text-xl">
                    ₹
                    {calculateDiscountedPrice(
                      product.unitPrice,
                      product.discount
                    )}
                  </p>

                  <span className="line-through font-normal font-segoe text-gray-400 text-xl ps-2">
                    {"₹" + product.unitPrice}
                  </span>
                  
                  <div className="flex flex-col">
                  <span className="ms-2 flex text-xs text-heading">
                    {t("text-exclude-tax")}
                  </span>
                  <span className="ms-2 flex text-[8px] text-red-500">
                    Some message will apear here
                  </span>

                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center mt-0">
                <div className="text-heading font-bold flex gap-1">
                  <p className="text-xl">{"₹" + product.unitPrice}</p>
                  <span className="ms-2 flex text-xs text-heading">
                    {t("text-exclude-tax")}
                  </span>
                </div>
              </div>
            )}
          
          </div>

          <div className=" flex flex-col lg:gap-4 gap-3 mt-2 mb-2 pb-4">
            {product?.varients && (
              <div className="flex flex-col gap-1">
                <span className="text-sm font-segoe font-semibold text-heading">
                  <p className="m-0">
                    Type: <span className="text-xs ">{activeProductName}</span>
                  </p>
                </span>
                <div className={`flex gap-2`}>
                  {product?.varients?.map((item: any, index: any) => (
                    <button
                      className={`h-8 w-8 border ${
                        activeProductName === item.name
                          ? "border-gray-900"
                          : "border-gray-400"
                      } rounded-md flex items-center justify-center`}
                      key={index}
                      onClick={() => {
                        setActiveProduct(true);
                        setActiveProductName(item.name);
                      }}
                    >
                      <img src={item.src} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          
            <div>
              <span className="text-sm font-segoe font-semibold text-heading">
                Offers
              </span>
              <ul className="flex flex-col gap-1">
                <li className="text-xs text-green-700 font-semibold font-segoe flex gap-2 tracking-wide items-center">
                  <IoPricetagOutline color="black" /> Order  and get upto 10%
                  off.
                </li>
                <li className="text-xs text-green-700 font-semibold font-segoe flex gap-2 tracking-wide items-center">
                  <IoPricetagOutline color="black" /> Get flat 5% off on Bulk
                  order.
                </li>
                <li className="text-xs text-green-700 font-semibold font-segoe flex gap-2 tracking-wide items-center">
                  <IoPricetagOutline color="black" /> Get a free Demo on Bulk
                  order.
                </li>
                <ProductSlider forOffers={true} />
              </ul>
             

            </div>
            {!isRetail && <ProductBasicInfo />}
            <div className="flex flex-row justify-between items-center ">
              {/* <ProductAttributes
              title="Available colors"
              className="mt-4"
              values={product.colors}
              isColor={true}
              activeValue={selectedColor}
              selectable={true}
              onClick={(value: string) => setSelectedColor(value)}
              image={product.images}
              activeImg={activeImg}
              setActiveImage={setActiveImage}
              handleImageClick={handleImageClick}
            /> */}

              {/* Bulk, sample and demo buttons */}
              {!isRetail && (
                <div className="flex flex-row gap-2 items-center ">
                  {!(router?.query?.convertToBooking === "true") &&
                    product?.demoAttributes && (
                      <ProductSlider
                        forSample={true}
                        forBulk={false}
                        forDemo={false}
                        handleCart={handleAddToCart}
                        buyNow={handleGoToDesigner}
                        product={product}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                        activeImg={activeImg}
                        setActiveImage={setActiveImage}
                        handleImageClick={handleImageClick}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                        selectDecoration={selectDecoration}
                        setSelectedDecoration={setSelectedDecoration}
                        selectedQuantity={selectedQuantity}
                        setSelectedQuantity={setSelectedQuantity}
                        customValue={customValue}
                        setCustomValue={setCustomValue}
                        samplebtn={samplebtn}
                        tieredPrice={product?.tieredPricing}
                        amt={amt}
                        activeProductName={activeProductName}
                        slug={slug}
                        setIsResetOption={setIsResetOption}
                        isResetOption={isResetOption}
                        colors={product?.demoAttributes?.Color}
                      />
                    )}
                  {product?.bulkAttributes && (
                    <ProductSlider
                      forSample={false}
                      forBulk={true}
                      forDemo={false}
                      handleCart={handleAddToCart}
                      buyNow={handleGoToDesigner}
                      product={product}
                      selectedColor={selectedColor}
                      setSelectedColor={setSelectedColor}
                      activeImg={activeImg}
                      setActiveImage={setActiveImage}
                      handleImageClick={handleImageClick}
                      selectedSize={selectedSize}
                      setSelectedSize={setSelectedSize}
                      selectDecoration={selectDecoration}
                      setSelectedDecoration={setSelectedDecoration}
                      selectedQuantity={selectedQuantity}
                      setSelectedQuantity={setSelectedQuantity}
                      customValue={customValue}
                      setCustomValue={setCustomValue}
                      samplebtn={samplebtn}
                      tieredPrice={product?.tieredPricing}
                      amt={amt}
                      activeProductName={activeProductName}
                      slug={slug}
                      setIsResetOption={setIsResetOption}
                      isResetOption={isResetOption}
                      colors={product?.bulkAttributes?.Color}
                    />
                  )}
                  {!(router?.query?.convertToBooking === "true") &&
                    product?.demoAttributes && (
                      <ProductSlider
                        forSample={false}
                        forBulk={false}
                        forDemo={true}
                        handleCart={handleAddToCart}
                        buyNow={handleGoToDesigner}
                        product={product}
                        selectedColor={selectedColor}
                        setSelectedColor={setSelectedColor}
                        activeImg={activeImg}
                        setActiveImage={setActiveImage}
                        handleImageClick={handleImageClick}
                        selectedSize={selectedSize}
                        setSelectedSize={setSelectedSize}
                        selectDecoration={selectDecoration}
                        setSelectedDecoration={setSelectedDecoration}
                        selectedQuantity={selectedQuantity}
                        setSelectedQuantity={setSelectedQuantity}
                        customValue={customValue}
                        setCustomValue={setCustomValue}
                        samplebtn={samplebtn}
                        activeProductName={activeProductName}
                        colors={product?.bulkAttributes?.Color}
                        isConvertToOrder={
                          router?.query?.convertToBooking === "true"
                            ? true
                            : false
                        }
                      />
                    )}
                </div>
              )}

              {isRetail && (
                <div className="flex flex-col gap-2 justify-center items-start w-full border border-red-500">
                  <button className="">Add to cart</button>
                </div>
              )}
            </div>
            {/* <ProductAttributes
              title="Available Sizes"
              values={product.sizes}
              activeValue={selectedSize}
              selectable={true}
              onClick={(value: string) => setSelectedSize(value)}
            /> */}
            {/* <h3 className="text-md text-heading font-semibold capitalize">
                Quantity
              </h3>
              <div className="flex flex-row gap-1">

 <button
              className={`px-3 py-2  ${
                isSample
                  ? "bg-[#ebf9f5] text-green-600 ease-in-out"
                  : "text-gray-600 "
              }  rounded-2xl font-bold`}
              onClick={() => setIsSample(true)}
            >
              Sample
            </button>
            <button
              className={`px-3 py-2  ${
                !isSample
                  ? "bg-[#ebf9f5] text-green-600 ease-in-out"
                  : "text-gray-600"
              }  rounded-2xl font-bold `}
              onClick={() => setIsSample(false)}
            >
              Bulk
            </button>
              </div> */}

            {/* {isSample ? ( */}

            {/* <div className="flex flex-col">
                  <div className="flex flex-col justify-between">
                    {product.purchasableFromTheApp && (
                      <ProductAttributes
                        isQuantity={true}
                        values={[4, 8, 12, 16]}
                        activeValue={selectedQuantity}
                        selectable={true}
                        onClick={(value: string) => setSelectedQuantity(value)}
                        customValue={customValue}
                        setCustomValue={setCustomValue}
                        samplebtn={samplebtn}
                      />
                    )}
                  </div>
                </div> */}

            {/* ) : ( */}
            <>
              {/* <div>
                    <div className="min-w-full ">
                      <div className="flex flex-col">
                        <div className="flex flex-row items-center w-full md:w-1/2">
                          <RangeSlider
                            // setSelectedQuantity={(value: string) =>
                            //   setSelectedQuantity(value)
                            // }
                            samplebtn={samplebtn}
                            amt={amt}
                            min={Number(product.tieredPricing[0].min)}
                            max={Number(product.tieredPricing[0].max)}
                            step={1}
                            range={customValue}
                            setRange={(e: any) =>
                              setCustomValue(e.target.value)
                            }
                            product={product}
                          />
                          {product.purchasableFromTheApp && (
                            <ProductAttributes
                              isQuantity={true}
                              values={[4, 8, 12, 16]}
                              activeValue={selectedQuantity}
                              selectable={true}
                              onClick={(value: string) =>
                                setSelectedQuantity(value)
                              }
                              customValue={customValue}
                              setCustomValue={setCustomValue}
                              samplebtn={"bulk"}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div> */}
            </>
            {/* )} */}
            {/* {showSampleButton && (
              <li>
                <input
                  id="1"
                  type="radio"
                  checked={samplebtn === "sample"}
                  label="sample"
                  value="sample"
                  onChange={handleChange}
                />
                <label className="pl-2">
                  Sample (Per unit of item costs 3×)
                </label>
              </li>
            )} */}

            {/* 
            {product.isDesignable && (
              <ProductAttributes
                title="Available Decorations"
                values={product.decorations}
                largeContent={true}
                activeValue={selectDecoration}
                selectable={true}
                onClick={(value: string) => setSelectedDecoration(value)}
              />
            )} */}
            {/* <li>
              <input
                id="1"
                type="radio"
                checked={samplebtn === "bulk"}
                label="bulk"
                value="bulk"
                onChange={handleChange}
              />
              
            </li> */}

            {/* {product.purchasableFromTheApp && (
              <ProductAttributes
                title={quantityTitle}
                isQuantity={true}
                selectable={true}
                onClick={(value: string) => setSelectedQuantity(value)}
                customValue={customValue}
                setCustomValue={setCustomValue}
                samplebtn={samplebtn}
              />
            )} */}
            {/* {product.isDesignable && (
              <ProductAttributes
                title="Available Decorations"
                values={product.decorations}
                largeContent={true}
                activeValue={selectDecoration}
                selectable={true}
                onClick={(value: string) => setSelectedDecoration(value)}
              />
            )} */}
          </div>
          {/* disgn it yourself button  */}
          {/* <div className="flex flex-col gap-2">
            {(product.purchasableFromTheApp && (
              <>
                {product.isDesignable && (
                  <div className="flex flex-col justify-center items-center w-full sm:w-1/2">
                    <Button
                      onClick={handleGoToDesigner}
                      variant="slim"
                      className={`w-full ${
                        skipDesign ? "bg-red-200" : "bg-red-400"
                      }`}
                    >
                      <span className="py-2 3xl:px-8 text-semibold text capitalize">
                        Design It Yourself
                      </span>
                    </Button>
                    {skipDesign ? (
                      <span
                        className="3xl:px-8 hover:underline mt-1 cursor-pointer text-[12px] "
                        onClick={() => setSkipDesign(false)}
                      >
                        Design
                      </span>
                    ) : (
                      <span
                        className="3xl:px-8 hover:underline mt-1 cursor-pointer text-[12px] "
                        onClick={() => setSkipDesign(true)}
                      >
                        Skip Design
                      </span>
                    )}
                  </div>
                )}
              </>
            )) || (
              <Button
                onClick={handleContactSales}
                variant="slim"
                className={`w-full`}
              >
                <span className="py-2 3xl:px-8 text-semibold text-lg capitalize">
                  Contact sales
                </span>
              </Button>
            )}
          </div> */}

          {/* <div className="py-6">
            <ul className="text-sm space-y-5 pb-1">
              {product.minimumQuantity && (
                <li>
                  <span className="font-semibold text-heading inline-block pe-2">
                    MOQ:
                  </span>
                  {product.minimumQuantity}
                </li>
              )}

              {product.sku && (
                <li>
                  <span className="font-semibold text-heading inline-block pe-2">
                    SKU:
                  </span>
                  {product.sku}
                </li>
              )}

              {!!prodes(category.slug)}
                      className="inline-block pe-1.5 transition capitalize hover:underline hover:text-heading hover:cursor-pointer last:pe-0"
                    >
           
                    </div>
                  ))}
                </li>
              )}
            </ul>
          </div> */}

          {/* {product?.details && <ProductAdditionalDetails product={product} />} */}
          {/* <div className="w-full mt-4 flex justify-start items-start">

          {showSampleButton &&
            isSample === true &&
      {shippingCostObj}
                taxCostObj={taxCostObj}
             '}
              />
            )}

          {showSampleButton &&
            isSample === false &&
     */}
          {/* {!showSampleButton &&
            
            )} */}
          <hr />
          {true && (
            <div className="border border-gray-400 rounded-lg p-2 w-[56%] mt-5 -z-10">
              {/* {product?.details && ( */}
              <ProductAdditionalDetails
                product={product}
                title="Product Highlights"
                desc={product?.description}
              />
              {/* )} */}
              <hr />
              {/* {product?.details && ( */}
              <ProductAdditionalDetails
                product={product}
                title="Product Description"
                desc={product?.description}
              />
              {/* )} */}
              <hr />
              {/* {product?.details && ( */}
              <ProductAdditionalDetails
                product={product}
                title="Delivery & Return Policy"
                desc={product?.description}
              />
              {/* )} */}
            </div>
          )}
          {/* <div className="w-[56%] mt-4">
            <ProductSlider forProposal={true} />
          </div> */}

          <div className="w-[100%]  mt-5" id="review">
            {product?.reviews.length>0 && (
              <div
                className=" relative flex flex-col items-start py-4 w-full"
                id="detail"
              >
                <div className="w-full flex flex-row -z-10">
                  <div className="text-left mb-1 font-semibold text-heading text-md font-segoe w-1/2">
                    {t("text-latest-review")}
                  </div>
                  <div className="text-left mb-1 font-semibold text-heading text-md font-segoe w-1/2">
                    Rate product
                  </div>
                </div>
                <div className="mb-4 w-full flex md:flex-row flex-col justify-between -z-10">
                  <ReviewCount />
                  <div className="w-1/2 flex flex-row gap-2 ">
                    <div className="flex-col flex gap-1">
                      <ReactStars
                        count={5}
                        edit={true}
                        size={15}
                        color="gray"
                        activeColor="black"
                        value={4}
                        isHalf={true}
                        
                      />

                      <input
                        placeholder="Title"
                        type="text"
                        className="border-2 border-gray-500 w-40 h-6  rounded-md text-left px-2 text-xs focus:outline-none focus:border-gray-600"
                      />
                      <textarea
                        rows={2}
                        placeholder="Write your review"
                        className="border-2 border-gray-500 w-40   rounded-md text-left p-2 text-xs focus:outline-none focus:border-gray-600"
                      />
                    </div>
                    <div className="h-full flex flex-col items-end justify-end">
                      <button className="px-2 py-1 shadow-product bg-gray-300 border-gray-300 rounded-md text-xs font-segoe border active:bg-gray-200">
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <ProductReviewCard review={product.reviews[0]} />
                  <ProductReviewCard review={product.reviews[0]} />
                  <ProductReviewCard review={product.reviews[0]} />
                </div>

                <Button onClick={toggleReviewsModal} className="mt-5 -z-10">
                  {t("button-see-all-reviews")}
                </Button>
              </div>
            )}

            <ProductReviewsModal
              open={reviewsModalOpen}
              reviews={product?.reviews}
              closeModal={closeReviewsModal}
            />
          </div>
        </div>
      </div>
      </div>
      {/* REVIEWS HERE */}

      {/* <h2 className="text-heading flex justify-between text-lg  font-bold  mb-2">
        Product Details
      </h2> */}
      {/* <ProductDescription
        title="Product Highlights"
        titleTwo="Product Description"
        titleThree="Delivery & Return Policy"
      /> */}

      {/* <ProductRecommendation title="Bought together" />
      <ProductRecommendation title="Trending products" /> */}
      <ProductRecommendation
        title="Related products"
        products={relatedProduct}
      />
    </>
  );
};

export default ProductSingleDetails;
