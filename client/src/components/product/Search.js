import React, { Fragment,useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './search.css'
import MetaData from '../layouts/MetaData';
const Search = () => {
    
    const navigate = useNavigate();
const [keyword,setKeyword] = useState(''); 
    const searchHandler= (e)=>{
        e.preventDefault();
        if(keyword.trim()){
        navigate(`/products/${keyword}`)
        }
        else{
            navigate(`/products`);
        }
    }


  return (
    <Fragment>
           <MetaData title="Search A Product -- ECOMMERCE" />
           <div>
          <form className='searchBox' onSubmit={searchHandler}>
         <input type='text' placeholder='search' onChange={(e)=> setKeyword(e.target.value)} value={keyword}/>
        <input type='submit' value="Search"/>
    </form>
          </div>
        </Fragment>

  )
}

export default Search