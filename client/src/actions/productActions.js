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
} from '../constants/productConstants.js'

export const getProduct =(finalKeyword='',currentPage= 1, price=[0,50000] , rating=0) => async(dispatch)=>{
    try {
        dispatch({type : ALL_PRODUCT_REQUEST})
        let link =`/products?keyword=${finalKeyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&rating[gte]=${rating}`;
        const {data} =  await axios.get(link);
        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: ALL_PRODUCT_FAIL,
            payload: error.response.data.message,
        });
    }
}

export const getProductDetails =(id)=> async(dispatch)=>{
    try {
        dispatch({type : ALL_PRODUCT_DETAILS_REQUEST})

        const {data} = await axios.get(`/product/${id}`)
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

        const config={
            headers:{"Content-Type":"application/json"}
        }

        const {data} = await axios.put('/product/review',reviewData,config);

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

