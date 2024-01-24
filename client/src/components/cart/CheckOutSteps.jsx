import { Step, Stepper,StepLabel, Typography } from '@mui/material'
import React, { Fragment } from 'react'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import './Check.css'

const CheckOutSteps = ({activeStep}) => {
   const steps=[
    {
        label:<Typography>Shipping Details</Typography>,
        icon:<LocalShippingIcon/>
    },
    { 
       label:<Typography>Confirm Order</Typography>,
       icon:<LibraryAddCheckIcon/>
    },
    {
        label:<Typography>Payment</Typography>,
        icon:<AccountBalanceIcon/>
    },
   ]

   const stepStyles = {
    boxSizing:"border-box",
    // width:"80%",
    transform:` {activeStep = 0 ? translateY(45px) : translateY(45px)}`,

   }
  return (
   <Fragment>
    <Stepper alternativeLabel activeStep={activeStep} style={stepStyles}>
        {steps.map((item,index)=>(
            <Step
            key={index}
            active={activeStep==index?true:false}
            completed={activeStep>=index?true:false}
            >
                <StepLabel style={{color:activeStep >=  index? "#1F74BA" : "rgba(0, 0, 0, 0.649)"}}
                 icon={item.icon} >
                    {item.label}
                </StepLabel>
            </Step>
        ))}
    </Stepper>
   </Fragment>
  )
}

export default CheckOutSteps