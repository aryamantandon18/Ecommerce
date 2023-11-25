import React from 'react'
import ReactStars from 'react-stars';
import profilePng from '../../images/Profile.png'

const ReviewCard = ({review}) => {
    const options={
        count:"5",  // number of stars
        value:review.rating,  // initial rating
        size:"24",  // size of the stars
        color2:"tomato",  // color of selected stars
        half:true, 
        edit:false,
    };

  return (
    <div className='reviewCard'>
        <img src={profilePng} alt='User'/>
        <p>{review.name}</p>
        <ReactStars {...options}/>
        <span className='reviewCardComment'>{review.comment}</span>
    </div>
  )
}

export default ReviewCard