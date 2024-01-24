
import { LOGIN_REQUEST,LOGIN_SUCCESS,LOGIN_FAIL,CLEAR_ERRORS,REGISTER_USER_SUCCESS,REGISTER_USER_FAIL,REGISTER_USER_REQUEST,LOAD_USER_SUCCESS,LOAD_USER_REQUEST,LOAD_USER_FAIL, LOGOUT_SUCCESS ,LOGOUT_FAIL,UPDATE_PROFILE_FAIL,UPDATE_PROFILE_REQUEST,UPDATE_PROFILE_SUCCESS,UPDATE_PASSWORD_FAIL,UPDATE_PASSWORD_RESET,UPDATE_PASSWORD_REQUEST,UPDATE_PASSWORD_SUCCESS, FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAIL, RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL} from "../constants/userConstant.js"
import axios from "axios";

export const login=(email,password) => async(dispatch)=>{
    try {
        dispatch({type:LOGIN_REQUEST});
        const config={ headers:{"Content-Type":"application/json"} };

        const {data} = await axios.post("/users/login",
        {email,password},
        config
        );

        dispatch({type:LOGIN_SUCCESS,payload:data.user});

    } catch (error) {
        dispatch({type:LOGIN_FAIL,payload:error.response.data.message});
    }
}

export const clearErrors=() =>async(dispatch)=>{
    dispatch({type: CLEAR_ERRORS}); 
}

export const register=(userData)=>async(dispatch)=>{
try {
    dispatch({type:REGISTER_USER_REQUEST})

    const config = { headers:{"Content-Type":"multipart/form-data"} };

    const {data} = await axios.post("/users/new",userData,config);

    dispatch({type:REGISTER_USER_SUCCESS,payload:data.user});

} catch (error) {
    console.log(error);
    dispatch({type:REGISTER_USER_FAIL,payload:error.response.data.message});
}
}


export const updateProfile=(userData)=>async(dispatch)=>{
    try {
        dispatch({type:UPDATE_PROFILE_REQUEST})
    
        const config = { headers:{"Content-Type":"multipart/form-data"} };     //bcoz we send images also as form data
    
        const {data} = await axios.put("/users/me/update",userData,config);
    
        dispatch({type:UPDATE_PROFILE_SUCCESS,payload:data.user});
    
    } catch (error) {
        console.log(error);
        dispatch({type:UPDATE_PROFILE_FAIL,payload:error.response.data.message});
    }
    }

    export const updatePassword=(passwords)=>async(dispatch)=>{
        try {
            dispatch({type:UPDATE_PASSWORD_REQUEST})
        
            const config = { headers:{"Content-Type":"application/json"} };   
        
            const {data} = await axios.put("/users/password/update",passwords,config);
        
            dispatch({type:UPDATE_PASSWORD_SUCCESS,payload:data.user});
        
        } catch (error) {
            console.log(error);
            dispatch({type:UPDATE_PASSWORD_FAIL,payload:error.response.data.message});
        }
        }   

     
    export const forgotPassword=(email)=>async(dispatch)=>{
        try {
            dispatch({type:FORGOT_PASSWORD_REQUEST})
        
            const config = { headers:{"Content-Type":"application/json"} };   
        
            const {data} = await axios.post("/users/password/forgot",email,config);
        
            dispatch({type:FORGOT_PASSWORD_SUCCESS,payload:data.message});
        
        } catch (error) {
            console.log(error);
            dispatch({type:FORGOT_PASSWORD_FAIL,payload:error.response.data.message});
        }
        }
        
 export const resetPassword=(token,passwords)=>async(dispatch)=>{
            try {
                dispatch({type:RESET_PASSWORD_REQUEST})
            
                const config = { headers:{"Content-Type":"application/json"} };   
            
                const {data} = await axios.put(`/users/password/reset/${token}`,passwords,config);
            
                dispatch({type:RESET_PASSWORD_SUCCESS,payload:data.success});
            
            } catch (error) {
                console.log(error);
                dispatch({type:RESET_PASSWORD_FAIL,payload:error.response.data.message});
            }
            }           

export const loadUser =() => async(dispatch)=>{
    try {
        dispatch({type:LOAD_USER_REQUEST});

        const {data} = await axios.get("/users/me");

        dispatch({type:LOAD_USER_SUCCESS,payload:data.user});

    } catch (error) {
        dispatch({type:LOAD_USER_FAIL,payload:error.response.data.message});
    }
}

export const logout=() => async(dispatch)=>{
    try {
        await axios.get("/users/logout");
        dispatch({type:LOGOUT_SUCCESS})

    } catch (error) {
        dispatch({type:LOGOUT_FAIL,payload:error.response.data.message});
    }
}