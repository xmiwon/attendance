const handleGetData = (req, res, db, dayjs) => {
    db.select(
        'check_in_out.id',
         'check_in_out.user_id',
          'check_in_out.checkin',
           'check_in_out.checkout',
            'check_in_out.description',
             'check_in_out.date',
             'users_list.username'
             )
    .from('check_in_out')
    .innerJoin('users_list', 'check_in_out.user_id', 'users_list.id')
    .then(data => {
        const sortDataById = data
        sortDataById.sort((a, b) => a.id - b.id)
        let currentMonthData = []
        sortDataById.map(item => {
           let compareMonth = item.date.slice(5, 7)
          compareMonth === dayjs().format('MM') &&
          currentMonthData.push(item)
        })
        res.send(currentMonthData)
    })

}

module.exports = {
    handleGetData: handleGetData
}