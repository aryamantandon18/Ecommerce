import {createStore,combineReducers,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from "redux-devtools-extension";
import { productDetailsReducer, productReducer } from './reducers/productReducer';
import {ProfileReducer, UserReducer} from './reducers/userReducer'
//define your reducer
const reducer = combineReducers({
products : productReducer,
productDetails: productDetailsReducer,
user:UserReducer,
profile:ProfileReducer,
});


let initialState = {};
const middleware = [thunk];

// Create the Redux store with the DevTools extension
const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware)));


export default store;