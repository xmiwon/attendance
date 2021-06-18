// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React, { useState, useEffect } from 'react';
import './App.css';
import Clock from './Clock/Clock'
import CheckControl from './CheckControl/CheckControl'
import List from './List/List'
import * as microsoftTeams from "@microsoft/teams-js";
import Modal from './Modal/Modal'
import WarningBox from './WarningBox/WarningBox'
import DownloadFileBtn from './DownloadFileBtn/DownloadFileBtn'

const Tab = (props) => {
  const [context, setContext] = useState({})
  //microsoft context user info
  const [users, setUsers] = useState(''),
  //api users in list
        [usersList, setUsersList] = useState([])

       const [isCheckedIn, setIsCheckedIn] = useState()
  //timer
  const [timer, setTimer] = useState(0)

  const [day, setDay] = useState(),
        [hour, setHour] = useState(),
        [minute, setMinute] = useState(),
        [second, setSecond] = useState()

  const [isModalOpen, setIsModalOpen] = useState(false)


  let userName = Object.keys(context).length > 0 ? context['userPrincipalName'] : "";
      let userId = Object.keys(context).length > 0 ? context['userObjectId'] : "";

useEffect(() => {
 // Get the user context from Teams and set it in the state
  microsoftTeams.getContext((context, error) => {
    setContext(context)
  });
 fetch('https://graph.microsoft.com/v1.0/me/chats/19:8b081ef6-4792-4def-b2c9-c363a1bf41d5_5031bb31-22c0-4f6f-9f73-91d34ab2b32d@unq.gbl.spaces/members')
  .then(response => response.json())
  .then(user => setUsers(user))

}, [])




//Kollar om användaren har stämplat in vid uppstart
useEffect(() => {
    const userCheck = async () => {
    await fetch('http://localhost:4000/filtercheckins', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: userName
                })    
            })
            .then(response => response.json())
            .then(data => setIsCheckedIn(data)) 
} 
userCheck()
},[usersList, users])
  

//timer
useEffect(() => {
  setInterval(() => {
      setTimer(prevTime => prevTime + 1)
      if (timer > 100) {
          setTimer(0)                  
      }
  }, 1000)
}, [])

//fetch time
useEffect(() => {
  fetch('http://localhost:4000/time')
  .then(response => response.json())
  .then(data => {
      setDay(data.day)
      setHour(data.hour)
      setMinute(data.minute)
      setSecond(data.second)
  })
},[timer])





const toggleModal = () => {
  setIsModalOpen((isModalOpen) => !isModalOpen);
};


      
      return (
        <div style={{backgroundColor: 'rgb(42, 42, 42)'}}>
  {
    isModalOpen && 
      <Modal>
        <WarningBox userId={userId} userName={userName} toggleModal={toggleModal} usersList={usersList}/>
      </Modal>
  }
          <Clock 
            day={day} 
            hour={hour} 
            minute={minute} 
            second={second}    
          />
          <List userName={userName} setUsersList={setUsersList} usersList={usersList} />
          
          <CheckControl
            setIsCheckedIn={setIsCheckedIn}
            isCheckedIn={isCheckedIn} 
            userName={userName} 
            userId= {userId} 
            toggleModal={toggleModal} 
            hour={hour} 
            minute={minute} />
            
          
          <DownloadFileBtn />
        </div>
      );
  
}
export default Tab;