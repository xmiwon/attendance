const handleTime = (req, res, dayjs) => {
    const timeObj = {
        year: dayjs().year(),
        month: dayjs().month() + 1,
        day: dayjs().format('ddd'),
        hour: dayjs().format('HH'),
        minute: dayjs().format('mm'),
        second: dayjs().format('ss')
    } 
    res.send(timeObj)
}

module.exports = {
    handleTime: handleTime
}