const handleCheckIn = (req, res, dayjs, db) => {
    const { name, userId, description } = req.body

    let checkedIn = ''
    let checkedOut = ''
    let currentTime = dayjs().format('HH:mm')
   if(currentTime <= '23:48') {
       checkedIn = dayjs().format('HH:mm:ss')
   } else {
        checkedOut = dayjs().format('HH:mm:ss')
   }


    db.select('*').from('users_list')
        .where('username', '=', name)
        .then(data => {
            if (data.length > 0) {
                //if username exists
                db.select('*').from('users_list')
                    .where('username', '=', name)
                    .then(data => {
                        db.transaction(trx => {
                            trx.insert({
                                "user_id": data[0].id,
                                "checkin": currentTime >= '09:30' && currentTime <= '16:30' ? `${checkedIn} (LATE)` : checkedIn,
                                "checkout": checkedOut,
                                "description": description,
                                "date": dayjs().format('YYYY-MM-DD')
                            })
                                .into('check_in_out')
                                .then(trx.commit)
                        })
                    })
            } else if (data.length === 0) {
                //if username NOT exists       
                db.transaction(trx => {
                    trx.insert({
                        "userid": userId,
                        "username": name
                    })
                        .into('users_list')
                        .returning('id')
                        .then(data =>
                            trx('check_in_out')
                                .insert({
                                    "user_id": data[0],
                                    "checkin": currentTime >= '09:30' && currentTime <= '16:30' ? `${checkedIn} (LATE)` : checkedIn,
                                    "checkout": checkedOut,
                                    "description": description,
                                    "date": dayjs().format('YYYY-MM-DD')
                                })
                        )
                        .then(trx.commit)
                    res.status(200).json('You have successfully checked in!')
                })

            }
        })


    
}

module.exports = {
    handleCheckIn: handleCheckIn
}