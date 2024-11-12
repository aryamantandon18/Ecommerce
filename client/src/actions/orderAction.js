import{
    CREATE_ORDER_FAIL,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CLEAR_ERRORS,
    MY_ORDERS_REQUEST,
    MY_ORDERS_SUCCESS,
    MY_ORDERS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_FAIL
} from '../constants/orderConstant.js'

import axios from 'axios';
import { server } from '../index.js';

export const createOrder = (order) => async(dispatch) =>{
    try{
        dispatch({type:CREATE_ORDER_REQUEST})
        const config = {
            headers: {
              "Content-Type": "application/json",
            },
          withCredentials:true,
          };
        const {data} = await axios.post(`${server}/order/new`,order,config);
        console.log("this is data here ->",data);

        dispatch({type:CREATE_ORDER_SUCCESS,payload:data})
    }
    catch (error){
        dispatch({
            type:CREATE_ORDER_FAIL,
            payload:error.response.data.message,
        })
    }
}

export const myOrders = () => async (dispatch) => {
    try {
      dispatch({ type: MY_ORDERS_REQUEST });
  
      const { data } = await axios.get(`${server}/order/me`, {
        withCredentials: true
      });
  
      dispatch({ type: MY_ORDERS_SUCCESS, payload: data.orders });
    } catch (error) {
      dispatch({
        type: MY_ORDERS_FAIL,
        payload: error.response.data.message,
      });
    }
  };


export const getOrderDetails = (id) => async(dispatch) =>{
    try{
        dispatch({type:ORDER_DETAILS_REQUEST})

        const {data} = await axios.get(`${server}/order/${id}`, {
          withCredentials: true
        });

        dispatch({type:ORDER_DETAILS_SUCCESS,payload:data.order})
    }
    catch (error){
        dispatch({
            type:ORDER_DETAILS_FAIL,
            payload:error.response.data.message,
        })
    }
}

// Get All Orders (admin)
export const getAllOrders = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ORDERS_REQUEST });
    console.log("Before the order request");
    const config={
      // headers:{"Content-Type":"application/json"},
      withCredentials: true, 
  }
    const { data } = await axios.get(`${server}/admin/orders`,config); 

    dispatch({ type: ALL_ORDERS_SUCCESS, payload: data.orders });
  } catch (error) {
    dispatch({
      type: ALL_ORDERS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Order
export const updateOrder = (id, order) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ORDER_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials:true,
    };
    const { data } = await axios.put(
      `${server}/admin/order/${id}`,
      order,
      config
    );

    dispatch({ type: UPDATE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: UPDATE_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Order
export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ORDER_REQUEST });

    const { data } = await axios.delete(`${server}/admin/order/${id}`,{withCredentials:true });

    dispatch({ type: DELETE_ORDER_SUCCESS, payload: data.success });
  } catch (error) {
    dispatch({
      type: DELETE_ORDER_FAIL,
      payload: error.response.data.message,
    });
  }
};


export const clearErrors=() =>async(dispatch)=>{
    dispatch({type: CLEAR_ERRORS}); 
}