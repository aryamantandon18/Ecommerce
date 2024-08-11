// import { useUI } from '@contexts/ui.context';
import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5';
import { SampleCategoryFilter } from './Gender-filter';
import { SamplePriceFilter } from './Price-filter';
import { SampleDiscountFilter } from './Discount-filter';

const categories =[
  {
    id:1,
    name:"men",
    slug:"men",
  },
  {
    id:2,
    name:"women",
    slug:"women"
  },
  {
    id:3,
    name:"Girls",
    slug:"girls"
  },
  {
    id:4,
    name:"Boys",
    slug:"boys"
  }
]
const prices = [
  {
    id:1,
    name:"Rs. 112 to Rs. 2709",
    slug:"112To2709",
  },
  {
    id:2,
    name:"Rs. 2709 to Rs. 5306",
    slug:"2709To5306",
  },
  {
    id:3,
    name:"Rs. 5306 to Rs. 7903",
    slug:"5306To7903",
  },
  {
    id:4,
    name:"Rs. 7903 to Rs. 10500",
    slug:"7903To10500",
  }
]
const discounts = [
  {
    id:1,
    name:"10% and above",
    slug:"10%"
  },
  {
    id:2,
    name:"20% and above",
    slug:"20%"
  },
  {
    id:3,
    name:"30% and above",
    slug:"30%"
  },
  {
    id:4,
    name:"10% and above",
    slug:"10%"
  },
  {
    id:5,
    name:"10% and above",
    slug:"10%"
  },
  {
    id:6,
    name:"10% and above",
    slug:"10%"
  }
]
export const Filter = () => {
    // const router = useRouter();
    // const[filterOpen,setFilterOpen] = useState(false);
    // const closeSampleProductFilter = ()=>{setFilterOpen(false)}
  return (
    <>
     <div className="flex flex-col w-full h-full p-3">
      <div className="w-full flex justify-between items-center relative ps-5 md:ps-7 py-0.5 border-b border-gray-400">
        <h2 className="font-bold text-xl /md:text-2xl m-0 text-heading pb-4">
          Filter Products
        </h2>

        {/* <button
          className="flex text-2xl items-center justify-center text-gray-500 px-4 md:px-6 py-3 /lg:py-8 focus:outline-none transition-opacity hover:opacity-60"
          onClick={closeSampleProductFilter}
          aria-label="close"
        >
          <IoClose className="text-black mt-1 md:mt-0.5" />
        </button> */}
      </div>
      <div className='mt-1 border-b-2 border-gray-350 ps-5 md:ps-7 py-0.5 w-[90%]'>
        <SampleCategoryFilter categories={categories}/>
      </div>
     
      <div className='mt-1 border-b-2 border-gray-350 ps-5 md:ps-7 py-0.5 w-[90%]'>
        < SamplePriceFilter prices={prices}/>
      </div>
      <div className='mt-1 border-b-2 border-gray-350 ps-5 md:ps-7 py-0.5 w-[90%]'>
        < SampleDiscountFilter discounts={discounts}/>
      </div>
      </div>

    </>
    
  )
}

