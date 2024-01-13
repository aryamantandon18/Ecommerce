import { Elements } from '@stripe/react-stripe-js'
import React from 'react'
import { Outlet } from 'react-router-dom'

const ElementLayout = ({stripe}) => {
  return (
   <Elements stripe={stripe}>
    <Outlet/>
   </Elements>
  )
}

export default ElementLayout