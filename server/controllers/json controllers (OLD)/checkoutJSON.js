fs = require('fs');
const path = require('path')

const { v4: uuidv4 } = require('uuid');

const handleCheckout = (req, res, dayjs) => {
    let checkedIn = ''
    let checkedOut = ''
   if(dayjs().format('HH:mm') <= '23:48') {
       checkedIn = dayjs().format('HH:mm:ss')
   } else {
        checkedOut = dayjs().format('HH:mm:ss')
   }
   const { name, userId } = req.body
    const attendance = {
        "id": uuidv4(),
        "userId": userId,
        "name": name,
        "date": dayjs().format('YYYY-MM-DD'),
        "in": checkedIn,
        "out": checkedOut
    }

    const filePath = '../attendance.json'
    try {
        if (!fs.existsSync(filePath)) {
            const fd = fs.openSync(filePath, 'a')
            fs.writeFileSync(filePath, '[]')
            console.log('File Created')
            fs.closeSync(fs.openSync(filePath, 'a'))
        }  
      } catch(err) {console.error(err)}

     let rawdata = fs.readFileSync(filePath)
     let list = JSON.parse(rawdata)

     list.push(attendance)

     let data = JSON.stringify(list)
     fs.writeFileSync(filePath, data)

}

module.exports = {
    handleCheckout: handleCheckout
}