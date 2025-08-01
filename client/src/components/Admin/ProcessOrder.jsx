import React, { Fragment } from 'react'
import MetaData from '../layouts/MetaData'
import SideBar from './SideBar'
import ProcessOrderForm from './ProcessOrderForm'

const processOrder = () => {
  return (
    <Fragment>
        <MetaData title={'Order Update - Admin'}/>
        <div className='flex mt-16 sm:mt-20 h-[100vh] bg-[#DDDDDD] relative'>
            <SideBar/>
            <div className='w-full h-full p-6 border-l border-gray-300 grid place-items-center'>
                <ProcessOrderForm/>
            </div>
        </div>
    </Fragment>
  )
}

export default processOrder