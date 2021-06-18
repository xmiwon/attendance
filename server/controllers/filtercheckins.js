const handleFilterCheckIns = (req, res, db, dayjs) => {
   const { name } = req.body
   let currentDay = dayjs().format('YYYY-MM-DD')
         // false som default om array är [] = empty = då har ingen stämplat in för dagen
   let isUserCheckedIn = false;
    db.select(
        'check_in_out.id',
         'check_in_out.user_id',
          'check_in_out.checkin',
             'check_in_out.date',
             'users_list.username'
             )
    .from('check_in_out')
    .innerJoin('users_list', 'check_in_out.user_id', 'users_list.id')
    .then(data => {
        data.map(item => {    
            if(item.date === currentDay && item.username === name && item.checkin !== null) {
                return isUserCheckedIn = true  
            }      
        })
    })
    .then(() => res.send(isUserCheckedIn))

}


module.exports = {
    handleFilterCheckIns: handleFilterCheckIns
}