import { CheckBox } from "./Checkbox";
import React, {useState} from "react";
import { GoPlus } from "react-icons/go";
import { HiMiniMinus } from "react-icons/hi2";


export const SampleDiscountFilter = ({ discounts }) => {
  const [isActive, setIsActive] = useState(true);

  function handleItemClick(e) {
    const { value } = e.currentTarget;
    console.log("Line-53",value);
  }
  const items = discounts;

  return (
    <div className="block border-gray-300  mb-2 pb-2">
      <div className="flex justify-between">
      <h3 className="text-heading text-lg font-semibold  pb-2 pt-3">
        Discount
      </h3>
      <div className="cursor-pointer" onClick={()=> setIsActive(!isActive)}>
    {
      isActive ? <HiMiniMinus size={20}/>  : <GoPlus size={20}/>
    }
   
      </div>
      </div>
      <div className="mt-2 flex flex-col">
         <div className="mt-1 flex flex-col gap-1">
        {
          isActive ? items?.map((item) => (
           
            <CheckBox
            key={item._id}
            label={item.name}
            value={item.slug}
            onChange={handleItemClick}
          />
         
        )) : null
        } </div>
        {/* {} */}
      </div>
    </div>
  );
};
