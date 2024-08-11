import {
    ADD_TO_CART,
    REMOVE_CART_ITEM,
    SAVE_SHIPPING_INFO,
  } from "../constants/cartConstants";
  
  export const cartReducer = (
    state = { cartItems: [], shippingInfo: {} },
    action
  ) => {
    switch (action.type) {
      case ADD_TO_CART:
        const item = action.payload;
  
        const isItemExist = state.cartItems.find(          //The find function is used to check if there is an item in the cartItems array that has the same product property as the newly added item. If such an item exists, isItemExist will be a reference to that item; otherwise, it will be undefined.
          (i) => i.product === item.product
        );
  
        if (isItemExist) {
          return {
            ...state,                  //If isItemExist is truthy (meaning the item is already in the cart), the state is updated by mapping over cartItems and replacing the existing item with the updated item (item).
            cartItems: state.cartItems.map((i) =>
              i.product === isItemExist.product ? item : i
            ),
          };
        } else {
          return {
            ...state,
            cartItems: [...state.cartItems, item],
          };
        }
  
      case REMOVE_CART_ITEM:
        return {
          ...state,
          cartItems: state.cartItems.filter((i) => i.product !== action.payload),
        };
  
      case SAVE_SHIPPING_INFO:
        return {
          ...state,
          shippingInfo: action.payload,
        };
  
      default:
        return state;
    }
  };
  