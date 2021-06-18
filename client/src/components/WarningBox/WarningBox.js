import React, {useState, useEffect} from 'react'
import './WarningBox.css'
import io from 'socket.io-client'

import { Button } from 'react-bootstrap';


const WarningBox = ({toggleModal, userId, userName}) => {
    const [isChecked, setIsChecked] = useState(false),
          [description, setDescription] = useState(''),
          [isConfirmed, setIsConfirmed] = useState(false),
          [jsonMessage, setJsonMessage] = useState('')

    useEffect(() => setDescription(''),[isChecked])

    //Auto close window
    useEffect(() => {
       if(isConfirmed) {
           const timer = setInterval(() => {
             clearInterval(timer)
             setIsConfirmed(false)
             toggleModal()
        }, 5000)
       }     
      }, [isConfirmed])


    const onButtonSubmit = () => {
        const socket = io("http://localhost:4000")
        
        fetch('http://localhost:4000/checkout', {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                name: userName,
                userId: userId,
                description: description
            })    
        })
        .then(response => response.json().then(data => ({status: response.status, body: data})))
        .then(result => {
            if (result.status === 200) {
                setIsConfirmed(true)
                socket.emit('send-data')
            } else if (result.status === 400) { 
                setJsonMessage(result.body)
            }
        })          
    }


    const onInputChange = (e) => setDescription(e.target.value)
    
    
    return (
        <div className="warning-modal">
            <div className="warning-container">
            {
            isConfirmed === false ? 
            <>
                <div>
                    <div className="warning-section1">
                        <h1>Are you sure?</h1>
                        <span className="modal-close" onClick={toggleModal}>&times;</span>
                    </div>
                    <div className="warning-message-box">
                        <p>If you proceed, this will register as an early <span style={{color: 'red', fontWeight: 'bold'}}>Check out</span>. This will possibly result in salary reduction.</p>
                        {
                            jsonMessage === '' ? '' : 
                            <span style={{color: 'red', fontWeight:'bold'}}>{jsonMessage}</span>
                        }
                    </div>
                    <div>
                        <input id="confirm" style={{marginRight: '5px'}} onChange={() => setIsChecked(isChecked => !isChecked)} type="checkbox" /><label htmlFor="confirm">Yes, I'd like to state my reason.</label>
                    </div>
                    <div>
                        {
                            isChecked &&
                            <>
                                <textarea rows="3" onChange={onInputChange} maxLength="500" placeholder="Minimum 30 characters"/>
                                <span>{description.length}/500</span>      
                            </>    
                        }
                         
                    </div>
                </div>

                <div className="buttons-box">
                    <Button onClick={toggleModal} variant="secondary" size="lg">Cancel</Button>
                    {
                        description.length >= 30 ? <Button variant="danger" size="lg" onClick={()=> onButtonSubmit()}>Confirm</Button> : <Button variant="danger" size="lg" disabled >Confirm</Button>
                    }
                    
                </div>
            </> : 
                <>
                
                    <div className="warning-section1">
                        <h1>We hope to see you soon again!</h1>
                    </div>
                    <div className="confirm-message-box" style={{fontSize: '18px'}}>              
                            <p>"{description}"</p>    
                            <p>This window will close in 5 seconds..</p>
                    </div>
                </>
            }
            </div>   
            
    

        </div>
    )
}
export default WarningBox;