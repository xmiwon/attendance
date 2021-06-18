import React, {useEffect, useState} from 'react';
import './CheckButton.css'
import { Button } from 'react-bootstrap';
import io from 'socket.io-client'

let socket;
const Checkbutton = ({userName, name, variant, userId, time, toggleModal, isCheckedIn, setIsCheckedIn}) => {
    const [jsonMessage, setJsonMessage] = useState('')



    useEffect(() => {
    socket = io("http://localhost:4000")
        socket.on('checked', () => {
            fetch('http://localhost:4000/filtercheckins', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: userName
                })
            })
            .then(response => response.json())
            .then(data => setIsCheckedIn(data)) 
        })
    }, [])


    const onButtonSubmit = () => {
        //Check in
        if(time >= '05:00' && time <= '09:30' || !isCheckedIn) {
        fetch('http://localhost:4000/checkin', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                name: userName,
                userId: userId
            })    
        })
        .then(response => response.json())
        .then(data => setJsonMessage(data))
            socket.emit('check-in')
            socket.emit('send-data')
        }
         //Leave before 16:30
        else if(time > '09:30' && time < '16:30') {
            toggleModal() 
        }
        //Leave after 16:30
        else if (time >= '16:30'){
            fetch('http://localhost:4000/checkout', {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: userName,
                    userId: userId
                })    
        })
        .then(response => response.json())
        .then(data => setJsonMessage(data))
            socket.emit('send-data')
        }
       
    }


    return (
        <div className="button-container">
            <Button onClick={() => onButtonSubmit()} variant={variant} size="lg" block>{name}</Button>
            <p style={{color: 'white', textAlign:'center'}}>{jsonMessage}</p>
        </div>
    )
}

export default Checkbutton;