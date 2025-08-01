import axios from 'axios';
import{
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,ALL_PRODUCT_SUCCESS,
    CLEAR_ERRORS,
    ALL_PRODUCT_DETAILS_REQUEST,
    ALL_PRODUCT_DETAILS_SUCCESS,
    ALL_PRODUCT_DETAILS_FAIL,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_FAIL,
    ADMIN_PRODUCT_REQUEST,
    ADMIN_PRODUCT_SUCCESS,
    ADMIN_PRODUCT_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_FAIL,
    DELETE_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_FAIL,
    FEATURED_PRODUCTS_REQUEST,
    FEATURED_PRODUCTS_FAIL,
    FEATURED_PRODUCTS_SUCCESS,
} from '../constants/productConstants.js'
import { server } from '../index.js';

export const getProduct = (
    finalKeyword = "",
    currentPage = 1,
    price = [0, 50000],
    rating = 0,
    category = ""
  ) => async (dispatch) => {
    try {
      dispatch({ type: ALL_PRODUCT_REQUEST });
  
      // Constructing the API endpoint with optional category filter
      let link = `${server}/products?keyword=${finalKeyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&rating[gte]=${rating}`;
  
      // Append category to the query string if a category is selected
      if (category) {
        link += `&category=${category}`;
      }
  
      const { data } = await axios.get(link);
      dispatch({
        type: ALL_PRODUCT_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_PRODUCT_FAIL,
        payload: error.response?.data?.message,
      });
    }
  };
  
export const getFeaturedProducts = () => async(dispatch)=>{
  try {
    dispatch({type:FEATURED_PRODUCTS_REQUEST});
    const {data} = await axios.get(`${server}/products/featuredProducts`);
    console.log("Line 65 : ",data);
    dispatch({type:FEATURED_PRODUCTS_SUCCESS,payload:data.products});
  } catch (error) {
    dispatch({
      type:FEATURED_PRODUCTS_FAIL,
      payload:error.response?.data?.message || error?.message || 'Something went wrong',
    })
  }
}
//for ADMIN
export const getAdminProducts = () => async (dispatch) => {
    try {
      dispatch({ type: ADMIN_PRODUCT_REQUEST });
  
      const { data } = await axios.get(`${server}/admin/products`, {
        withCredentials: true
      });
  
      dispatch({
        type: ADMIN_PRODUCT_SUCCESS,
        payload: data.products,
      });
    } catch (error) {
      dispatch({
        type: ADMIN_PRODUCT_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const getProductDetails =(id)=> async(dispatch)=>{
    try {
        dispatch({type : ALL_PRODUCT_DETAILS_REQUEST})

        const {data} = await axios.get(`${server}/product/${id}`)
        dispatch({
            type: ALL_PRODUCT_DETAILS_SUCCESS,
            payload: data.product,
        })
    } catch (error) {
        dispatch({
            type: ALL_PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message,
        })
    }
}

    export const newReview = (reviewData)=>async(dispatch)=>{
        try {
            dispatch({type: NEW_REVIEW_REQUEST});

            const config = {
                headers: {"Content-Type":"application/json"},
                withCredentials: true, 
              };
            // console.log("SUBMITTING Review");
            const {data} = await axios.put(`${server}/product/review`,reviewData,config);
            // console.log("Review was DONE");
            // console.log("Line 107 ", data);

            dispatch({
                type:NEW_REVIEW_SUCCESS,payload:data.success
            })

        } catch (error) {
            dispatch({type:NEW_REVIEW_FAIL,payload:error.response.data.message});
        }
    }

export const clearErrors=() =>async(dispatch)=>{
    dispatch({type: CLEAR_ERRORS}); 
}

//Admin 
export const createProduct=(productData)=>async(dispatch)=>{
    try {
        dispatch({type:NEW_PRODUCT_REQUEST});
        const config={
            headers:{"Content-Type":"multipart/form-data"},
            withCredentials: true, 
        }
        const {data} = await axios.post(`${server}/admin/product/new`,productData,config);

        dispatch({
        type:NEW_PRODUCT_SUCCESS,
        payload:data,
        })
}
     catch(error) {
        console.log("Line 122 ",error);
        dispatch({
            type:NEW_PRODUCT_FAIL,
            payload:error.response.data.message,
        })
    }
}
//update Product
export const updateProduct=({id,productData})=>async(dispatch)=>{
    try {
        dispatch({type:UPDATE_PRODUCT_REQUEST});

        const config={
            headers:{"Content-Type":"multipart/form-data"},
            withCredentials: true, 
        }
        const {data} = await axios.put(`${server}/admin/product/${id}`,productData,config);

        dispatch({
        type:UPDATE_PRODUCT_SUCCESS,
        payload:data.success,
        })
}
     catch(error) {
        console.log("Line 146",error)
        dispatch({
            type:UPDATE_PRODUCT_FAIL,
            payload:error.response.data.message,
        })
    }
}

export const deleteProduct = (id)=>async(dispatch)=>{
    try{
        dispatch({ type:DELETE_PRODUCT_REQUEST })
        const {data} = await axios.delete(`${server}/admin/product/${id}`,{
            withCredentials: true,
          });

        dispatch({
            type:DELETE_PRODUCT_SUCCESS,
            payload:data.success,
        })

    }catch(error){
        dispatch({
            type:DELETE_PRODUCT_FAIL,
            payload:error.response.data.message,
        })
    }
}
