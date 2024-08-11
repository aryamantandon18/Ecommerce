import React, { useEffect, useRef, useState } from "react";
import SearchIcon from "@components/icons/search-icon";
import { siteSettings } from "@settings/site-settings";
import HeaderMenu from "@components/layout/header/header-menu";
import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import { ROUTES } from "@utils/routes";
import { AddActiveScroll } from "@utils/add-active-scroll";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
import LanguageSwitcher from "@components/ui/language-switcher";
import Link from "@components/ui/link";
import SearchBox from "@components/common/search-box";
import UserIcon from "@components/icons/user-icon";
import HeaderMenu2 from "./header-menu2";
import WishlistButton from "@components/wishlist/wishlist-button";
import Search from "@components/common/search";
import { CiUser } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { useRouter } from "next/router";
'import { getProductsMetadata } from "src/api/backend/public";'
import { LuUser2 } from "react-icons/lu";
import { IoMdCall } from "react-icons/io";
import SearchSection from "@components/landing-page/search-section";
import HeaderDropMenu from "./header-drop-menu";
import { TbShoppingBagEdit } from "react-icons/tb";
import English from "@components/landing-page/EnglishInr"
import { USFlag } from "@components/icons/USFlag";
import { BiWorld } from "react-icons/bi";
import { getProductsMetadata } from "src/api/backend/public";
import { Form, FormGroup, Label, Button, Input } from 'reactstrap';

import { LiaRupeeSignSolid } from "react-icons/lia";

const CartButton = dynamic(() => import("@components/cart/cart-button"), {
  ssr: false,
});

type DivElementRef = React.MutableRefObject<HTMLDivElement>;
const { site_header } = siteSettings;
const Header: React.FC = () => {
  const { openSidebar, setDrawerView, openSearch } = useUI();
  const { t } = useTranslation("common");
  const siteHeaderRef = useRef() as DivElementRef;
  AddActiveScroll(siteHeaderRef);
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const [search, setSearch] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isBusinessAccount, setIsBusinessAccount] = useState(true);
  const [isDropDownVisible, setIsDropDownVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [login,setLogin]=useState(true)
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    console.log("open sidebar");
    setSidebarOpen(!isSidebarOpen);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };


  const loadProductData = async () => {
    let { data } = await getProductsMetadata();
    if (!data) {
      console.log("Error while loading data for categories");
    }

    setCategories(data.categories);
  };

  useEffect(() => {
    loadProductData();

    return () => {};
  }, []);

  function handleMobileMenu() {
    setDrawerView("MOBILE_MENU");
    return openSidebar();
  }

  const currentRoute = router.route;

  useEffect(() => {
    if (currentRoute === "/") {
      const handleScroll = () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        setShowSearch(scrollY <= 380);
      };
      window.addEventListener("scroll", handleScroll);
    } else {
      setShowSearch(true);
    }
  }, [currentRoute]);

  useEffect(() => {
    if (search) {
      router.push(ROUTES.SEARCHPRODUCT);
    }
  }, [search]);
  const hideNavbarRoutes = ['/search-product'];
  const shouldHideNavbar = hideNavbarRoutes.includes(router.pathname);
  return (
    <header
      id="siteHeader"
      ref={siteHeaderRef}
      className=" hidden  fixed top-0 lg:flex items-center justify-center w-full sm:h-10 lg:h-20 z-70 shadow-header"
    >
      {/* remove stickyHeader for mobile. removed fixed  */}
      <div className="innerSticky body-font lg:fixed bg-white text-gray-700 justify-around items-center
      w-full  sm:h-10 lg:h-20  z-20  md:px-8 2xl:px-24 px-5 transition duration-200 ease-in-out border-b-1  border-gray-150"
      >
        {/* md:justify-between */}
        <div className="flex fixed items-center justify-between mx-auto max-w-[1920px] h-16 w-full ">
          <button
            aria-label="Menu"
            // IGNORED // This md:me-20 to push the logo to be centered on md devices. The btns column has 125px of width. To compensate.
            // Will hide the header actions and keep logo also on Ipad.
            // md:flex md:me-20  lg:hidden
            className="menuBtn hidden flex-col items-center justify-center px-5 2xl:px-7 flex-shrink-0 h-full outline-none focus:outline-none"
            onClick={handleMobileMenu}
          >
            <span className="menuIcon">
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </span>
          </button>
          
          {/* <HeaderMenu2 data={site_header.variant}/> */}

         
          {/* hide it on md too */}
          {/* md:flex */}
          {/* {!showSearch && ( */}
          <div className="w-[95%]  items-center justify-center">
            {/* <SearchBox /> */}
            {/* <SearchSection/> */}
            <div className="w-[100%] flex items-center justify-center">
            
            <div className="mt-7 flex items-center justify-center translate-x-[-55%]">
            <Logo /> 
            </div>
            <div
              className=" w-[55%] border border-gray-300 h-9 rounded-3xl translate-x-28 px-2 flex items-center justify-between cursor-pointer  mt-7"
              onClick={() => router.push(ROUTES.SEARCHPRODUCT)}
            >
              <p className="text-xs font-semibold font-segoe text-gray-400 m-0 flex items-center h-full ">
                What are u looking for ?
              </p>
              <div className="flex rounded-full bg-green-300 px-1 py-1  gap-1 border-2 translate-x-1 ">
              <span className="text-sm font-semibold">Search</span>
              <IoIosSearch />
              </div>
              

            </div>
            <div className="flex items-center w-[20%] mt-[2rem] justify-around h-8 ml-36">
           
              <div className="flex justify-around items-center w-full">
              {/* {isBusinessAccount && (
              <button
                onClick={() => router.push(ROUTES.Bussiness_Account)}
                className="lg:h-8  font-semibold bg-gradient-to-b to-gray-500  flex items-center cursor-pointer text-[12px] text-heading active:scale-95 transition-all justify-center"
              >
                 Premium
              </button>
            )} */}
             <div className="relative">
              <div
                className="text-sm flex items-center gap-2 justify-center cursor-pointer h-8"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center justify-center h-6">
                <LiaRupeeSignSolid size={18} />
                <div className="text-[12px] font-semibold flex flex-col justify-center items-center">
                
                  <span className="text-[12px] font-semibold">English-INR</span>
                  
                 
                </div>
                </div>
                {/* <div className="w-4 h-4 flex">
                
                 <USFlag/>
                </div> */}
                
              </div>
              {isHovered && (
                <div
                  className="absolute bg-white border border-gray-300 p-4 rounded mt-4 z-20 translate-x-[-43%] w-[300px]  shadow-2xl"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Decorative or indicator div */}
                  
                  <form className="w-[100%] flex flex-col rounded-lg h-50">
                    <p className="text-[12px] font-semibold text-black">Choose your Languge and Currency</p>
                  <FormGroup className="h-44">
                        <Label for="Language"
                        className="block text-xs font-medium text-gray-700 mt-4">Language</Label>
                        <Input
                          type="select"
                          name="Language"
                          id="Language"
                          className="block w-full h-8 py-1 px-1 border mt-1 border-gray-300 bg-white  shadow-sm focus:outline-none sm:text-xs"
                        >
                          <option>English</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </Input>
                        <Label for="exampleSelect"
                        className="block text-xs font-medium text-gray-700 mt-4">Currency</Label>
                        <Input
                          type="select"
                          name="currency"
                          id="currency"
                          className="block w-full h-8 py-1 px-1 border mt-1 border-gray-300 bg-white  shadow-sm focus:outline-none sm:text-xs"
                        >
                          <option>INR-Indian Rupees</option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </Input>
                        <Button className="text-center rounded-full bg-green-300 hover:bg-green-500 text-black text-xs semibold w-[100%] px-2 py-2 mt-4">Save</Button>
                      </FormGroup>
                    {/* Add more form elements as needed */}
                  </form>
                </div>
              )}
            </div>
          <div>
            {  login ? (
                 <Link
                 href={ROUTES.ACCOUNT}
                 className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none transform"
                 aria-label="my-account-button"
               >
                 <div className="h-full flex items-center justify-center relative ">
                   {/* <UserIcon /> */}
                   <div className="py-1">
                     <LuUser2 size={18} />
                   </div>
                   <p className=" m-1 absolute bg-heading h-3 w-3  rounded-lg flex items-center justify-center top-[-6px] text-white text-xs right-[-8px]">
                     2
                   </p>
                   {/* <CiUser size={24} className="text-black"/> */}
                 </div>
               </Link>
            ):(
                <div></div>
            )
              
                    
            }
       
            
            </div>
            <CartButton />
              </div>
             
            </div>
            </div>
            <div className="flex items-center justify-center  h-6 ">
            <span className="flex justify-center items-center w-[50%] translate-x-[-15%] ">
            {/* {Sampling Section} */}
            <div
           
            className={`
              items-center xl:text-[10px] flex gap-1 text-heading px-3 xl:px-4 py-1 font-semibold relative 
            `}
          >
          <div className="flex gap-1 text-[12px] font-semibold hover:bg-gray-300 rounded-full px-1 py-1 cursor-pointer">
            <TbShoppingBagEdit size={16}/>
            Sampling
          </div>
          {/* {(item?.columns || item.subMenu) && (
            <span className="opacity-30 text-xs mt-1 xl:mt-0.5 w-4 flex justify-end">
              <FaChevronDown className="transition duration-300 ease-in-out transform group-hover:-rotate-180" />
            </span>
          )} */}
            </div>  

            {/* {Demo} */}
            <>
            <div
             
              className={`items-center text-xs xl:text-xs text-heading px-3 xl:px-4 py-1 font-normal relative group-hover:text-black`}
            >
             <div className="flex gap-1 text-[12px] font-semibold hover:bg-gray-300 rounded-full  px-1 py-1 cursor-pointer"
              onClick={toggleSidebar}
              >
             <IoMdCall  size={18}/>
              Book a call
              </div>

              {/* {(item?.columns || item.subMenu) && (
              <span className="opacity-30 text-xs mt-1 xl:mt-0.5 w-4 flex justify-end">
                <FaChevronDown className="transition duration-300 ease-in-out transform group-hover:-rotate-180" />
              </span>
            )} */}
            
            </div>
         
            </>

           {/* {Gift }  */}
            <div
              
              className={`
             
            items-center text-xs xl:text-xs text-heading px-3 xl:px-4 py-1 font-normal relative group-hover:text-black`}
            >
             <div className="flex gap-1 text-[12px] font-semibold hover:bg-gray-300 rounded-full  px-1 py-1 cursor-pointer">
             <IoMdCall  size={18}/>
              Gift Store
              </div>

              {/* {(item?.columns || item.subMenu) && (
              <span className="opacity-30 text-xs mt-1 xl:mt-0.5 w-4 flex justify-end">
                <FaChevronDown className="transition duration-300 ease-in-out transform group-hover:-rotate-180" />
              </span>
            )} */}
            </div>
            
            {/* {Get Help} */}
            <div
              
              className={`
             
            items-center text-xs xl:text-xs text-heading px-3 xl:px-4 py-1 font-normal relative group-hover:text-black`}
            >
             <div className="flex gap-1 text-[12px] font-semibold hover:bg-gray-300 rounded-full  px-1 py-1 cursor-pointer">
             <IoMdCall  size={18}/>
              Get Help
              </div>

              {/* {(item?.columns || item.subMenu) && (
              <span className="opacity-30 text-xs mt-1 xl:mt-0.5 w-4 flex justify-end">
                <FaChevronDown className="transition duration-300 ease-in-out transform group-hover:-rotate-180" />
              </span>
            )} */}
            </div>
             </span>
             
             <div className="flex gap-1 h-full items-center menuItem group cursor-pointer">

          </div>
            </div>
             

            {/* <div
                className="flex flex-row gap-1 items-center justify-center cursor-pointer"
                onClick={() => setSearch(!search)}
              >
                <IoIosSearch/><p>Search</p>
              </div> */}
            {/* <Search/> */}
          </div>

         

          {/* )} */}
          <div className="flex justify-start gap-4 items-center h-full">
            {/* <button
              className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none transform"
              onClick={openSearch}
              aria-label="search-button"
            >
              
              <SearchIcon />
            </button> */}
            

            
            {/* <WishlistButton /> */}
            
          </div>
        </div>
      </div>

      {isDropDownVisible && (
        <HeaderDropMenu
          setIsDropDownVisible={setIsDropDownVisible}
          categories={categories}
        />
      )}
      {/* {
        isEnglishInr && (
          <English 
          SetIsenglish ={setIsEnglisg}
          />
        )
      } */}
    </header>
  );
};

export default Header;
