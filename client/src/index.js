import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
export const AppContext = createContext();

// Create the provider component
export const AppProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 50000]);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [finalKeyword,setFinalKeyword] = useState();
  return (
    <AppContext.Provider value={{currentPage,setCurrentPage, price,setPrice,rating,setRating,category,setCategory,finalKeyword,setFinalKeyword}}>
      {children}
    </AppContext.Provider>
  );
};

export const server = "http://localhost:4000";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
     <AppProvider>
      <App />
    </AppProvider>
  </Provider> 
);

//https://ecmm-nhgl.onrender.com
//http://localhost:4000
