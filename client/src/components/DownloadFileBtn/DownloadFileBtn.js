import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import io from 'socket.io-client'

const DownloadFileBtn = () => {
const [responseMessage, setResponseMessage] = useState()


const downloadFile = () => {
    fetch('http://localhost:4000/downloadreport')
    .then(response => response.json().then(data => ({status: response.status, body: data})))
    .then(result => {
            if (result.status === 200) 
                setResponseMessage(result.body)
            else if(result.status === 400) 
                setResponseMessage(result.body)         
        })  
    setTimeout(() => setResponseMessage(''), 5000) 
}

    return (
        <>
            <Button size="md" onClick={() => downloadFile()}>Download full report (.xlsx)</Button>
        
            <p style={{color: 'white', fontWeight: 'bold'}}>{responseMessage}</p>
        

        </>
    )
}

export default DownloadFileBtn;