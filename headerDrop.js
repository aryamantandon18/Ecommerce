import Link from "@components/ui/link";
import React from 'react'
import { useDispatch } from 'react-redux';
import { setselectedCategory } from 'src/redux/actions';

const HeaderDropMenu = ({setIsDropDownVisible, categories}: any) => {

    const dispatch = useDispatch();

    const handleCategoryGlobal = (category: string) => {
      dispatch(setselectedCategory(category))
    }

  return (
    <div className=" fixed top-10 left-0 right-0 border-t border-gray-300 bg-white shadow-cart h-[200px] py-3 flex gap-2 justify-between z-[99]  px-4 md:px-8 2xl:px-24 mt-10" onMouseEnter={() => setIsDropDownVisible(true)} onMouseLeave={() => setIsDropDownVisible(false)}>

        <div className="flex flex-col flex-wrap w-[60%] gap-1">
        {
            categories && categories.map((menu: any) => (
                <div className="" key={menu.slug} onClick= {() => handleCategoryGlobal(menu.slug)}>
                <Link
                  href={`/products?q=`}
                  className=" no-underline hover:text-black transition-all text-sm text-heading font-segoe"
                >
                  {menu.name}
                </Link>
              </div>
            ))
        }

        </div>

        <div className=" h-full w-[39%] border border-gray-500 rounded-md">
            <img src="/assets/images/category/sunglass.jpg" alt="" className="w-full h-full"/>
        </div>
    </div>
  )
}

export default HeaderDropMenu
