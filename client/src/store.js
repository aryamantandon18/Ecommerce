import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  newProductReducer,
  productDetailsReducer,
  productReducer,
} from "./reducers/productReducer";
import {
  ProfileReducer,
  UserReducer,
  forgotPasswordReducer,
} from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import {
  myOrdersReducer,
  newOrderReducer,
  orderDetailsReducer,
} from "./reducers/orderReducer";
import { deleteProduct } from "./actions/productActions";
//define your reducer
const reducer = combineReducers({
  products: productReducer,
  productDetails: productDetailsReducer,
  user: UserReducer,
  profile: ProfileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  newReview:newOrderReducer,
  newProduct:newProductReducer,
  deleteProduct:deleteProduct,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],

    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};
const middleware = [thunk];

// Create the Redux store with the DevTools extension
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools({
    trace: true, // This enables tracing in Redux DevTools
  })
  (applyMiddleware(...middleware))
);

export default store;
