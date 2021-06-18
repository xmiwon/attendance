const express = require('express'),
      cors = require('cors'),
      dayjs = require('dayjs'),
      ExcelJS = require('exceljs'),
      app = express(),
      server = app.listen(4000, () => console.log('Server is up and running at port 4000')),
      io = require('socket.io')(server, {
            cors: {
                  origin: 'https://localhost:3000'
            },
      }),
      knex = require('knex')
     

//old controllers

// const checkout = require('./controllers/checkout')
// const sendFile = require('./controllers/sendfile')


// controllers - DB
const checkoutDb = require('./controllers/checkout')
const checkinDb = require('./controllers/checkin')
const getData = require('./controllers/getdata')
const filterCheckIns = require('./controllers/filtercheckins')
const downloadReport = require('./controllers/downloadreport')
const time = require('./controllers/time')

      //middlewares
      app.use(express.json())
      app.use(cors())
    

const db = knex({
      client: 'pg',
      connection: {
            host: '127.0.0.1',
            user: 'postgres',
            password: '123',
            database: 'attendance'
      }
})


//socket.io
io.on("connection", socket => {
      socket.on('send-data', () => io.emit('receive-data'))
      socket.on('send-refresh', () => socket.emit('receive-refresh'))
      socket.on('check-in', () => socket.emit('checked'))
})

//JSON
// app.get('/getfile', (req, res) => sendFile.handleSendFile(req, res))
// app.post('/checkout', (req, res) => checkout.handleCheckout(req, res, dayjs))


//Skickar server tid till klienten för att förhindra klienter att fuska med "time travel" med incheckningen
app.get('/time', (req, res) => time.handleTime(req, res, dayjs))
app.post('/checkin', (req, res) => checkinDb.handleCheckIn(req, res, dayjs, db))
app.put('/checkout', (req, res) => checkoutDb.handleCheckOut(req, res, dayjs, db))
app.get('/getdata', (req, res) => getData.handleGetData(req, res, db, dayjs))
app.post('/filtercheckins', (req, res) => filterCheckIns.handleFilterCheckIns(req, res, db, dayjs))
app.get('/downloadreport', (req, res) => downloadReport.handleDownloadReport(req, res, db, dayjs, ExcelJS))
      