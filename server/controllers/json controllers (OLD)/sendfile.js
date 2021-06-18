fs = require('fs');

const handleSendFile = (req, res, dayjs) => {
    const filePath = '../attendance.json'
    try {
        let rawdata = fs.readFileSync(filePath)
        let data = JSON.parse(rawdata)
        if (fs.existsSync(filePath)) {
            return res.send(data)
        }  else {
            return res.send('Unable to provide request')
        }
      } catch(err) {console.error(err)}
}

module.exports = {
    handleSendFile: handleSendFile
}