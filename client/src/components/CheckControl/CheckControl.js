import React, { useState, useEffect } from 'react'
import CheckButton from '../CheckButton/CheckButton'

const CheckControl = ({userName, userId, toggleModal, hour, minute, isCheckedIn, setIsCheckedIn}) => {
const [loadButton, setLoadButton] = useState(false)


useEffect(() => {
    setTimeout(() => setLoadButton(true), 500)
}, [])

let time = `${hour}:${minute}`;
    return (
        <>
            {
                loadButton === true ?
                
               (
                    (time >= '06:00' && time <= '09:00') || !isCheckedIn ? 
                    <CheckButton
                        setIsCheckedIn={setIsCheckedIn}
                        isCheckedIn={isCheckedIn}
                        time={time} 
                        userName={userName} 
                        userId={userId} 
                        name="Check In"
                        />
                        
                    :
                    
                    (time >= '16:30') || (time >= '17:00')? 
                    <CheckButton 
                        setIsCheckedIn={setIsCheckedIn}
                        isCheckedIn={isCheckedIn}
                        time={time} 
                        userName={userName} 
                        userId={userId} 
                        variant="success" 
                        name="Check Out"
                        toggleModal={toggleModal} /> 
                    :
                    <CheckButton 
                        setIsCheckedIn={setIsCheckedIn}
                        isCheckedIn={isCheckedIn}
                        time={time}  
                        userName={userName} 
                        userId={userId} 
                        variant="warning" 
                        name="Check Out"
                        toggleModal={toggleModal} />
                ) : null
                
            }
          
        </>
    )
}
export default CheckControl;