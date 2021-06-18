import React, { useEffect, useState, useRef  } from 'react';
import './List.css'
import refreshBlue from './img/refresh-blue.svg'
import { Table } from 'react-bootstrap'
import io from 'socket.io-client'

let socket;

const List = ({setUsersList, usersList, userName}) => {
  const [inputSearch, setInputSearch] = useState('')
  
  let paddingRight;
  usersList.length < 5 ? paddingRight = '' : paddingRight = '15px'

  //Scroll to bottom of list
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
     socket = io("http://localhost:4000")
  },[])
  //körs en gång vid uppstart
useEffect(() => {
    fetch('http://localhost:4000/getdata')
      .then(response => response.json())
      .then(data => setUsersList(data))
}, [])

useEffect(() => {
  socket.on('receive-data', () => {
    fetch('http://localhost:4000/getdata')
      .then(response => response.json())
      .then(data => setUsersList(data))
  })
  }, [usersList])

useEffect(() =>  {
  socket.on('receive-refresh', () => {
  fetch('http://localhost:4000/getdata')
    .then(response => response.json())
    .then(data => setUsersList(data))
}) 
}, [])

  useEffect(() => {
    scrollToBottom()
  },[usersList])


const refreshBtn = () => {
  setUsersList([])
  setTimeout(() => socket.emit('send-refresh'), 500)
  
}

  const userSearch = (e) => setInputSearch(e.target.value)

  const filterUsers = usersList.filter(user => {
    return user.username.toLowerCase().includes(inputSearch.toLowerCase())
  })

    return (
        <div>
<Table striped bordered hover variant="dark" style={{margin: '0'}}>

  <thead id="table-head" style={{ paddingRight: paddingRight}}>
    <tr id="tr-head">
      <th>DATE (This month)<img id="refresh-btn" src={refreshBlue} onClick={() => refreshBtn()} /></th>
      <th>USER <input id="input-search" placeholder="Search users.." onChange={userSearch}/></th>
      <th>IN</th>
      <th>OUT</th>
      <th>REASON</th>
    </tr>
  </thead>
    <tbody id="table-body">
        {
          usersList.length !== 0 ? (
            filterUsers.map(user => {
            return (
              <tr key={user.id} id="tr-body">
                <td>{user.date}</td>
                {
                  user.username === userName ?
                  <td style={{color:'yellow', fontWeight: 'bold'}}>{user.username}</td> 
                  :
                  user.username === "" ? <td>No name</td> : <td>{user.username}</td>
                }
                
                <td>{user.checkin}</td>
                <td>{user.checkout}</td>
                {
                  !user.description ? <td>None</td> : <td style={{color:'red'}}>{user.description}</td>
                }
                
              </tr>
            )
          }) ): <tr id="tr-body">
                  <td>No data</td>
                </tr> 
        }  
        <tr ref={messagesEndRef} />
    </tbody>   
</Table>

        </div>
    )
}

export default List;