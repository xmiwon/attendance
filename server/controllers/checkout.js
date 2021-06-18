const handleCheckOut = (req, res, dayjs, db) => {
    const { name, userId, description } = req.body
    let currentTime = dayjs().format('HH:mm')
    let currentDay = dayjs().format('YYYY-MM-DD')
    
        db.select('check_in_out.id',
         'check_in_out.user_id',
          'check_in_out.checkin',
           'check_in_out.checkout',
           'check_in_out.description',
             'check_in_out.date',
             'users_list.userid')
             .from("check_in_out")
             .innerJoin('users_list', 'check_in_out.user_id', 'users_list.id')
             .where("userid", '=', userId)
             .then(data=>{
                 const sortDataById = data
                sortDataById.sort((a, b) => a.id - b.id)
                const lastUser = sortDataById[sortDataById.length-1]  

                 if(currentTime >= '16:30' && currentTime <= '23:59') {
                    if(lastUser.checkin !== null && !lastUser.checkout) {
                        db.select('id')
                        .from('check_in_out')
                        .where('id', '=', lastUser.id)
                        .update('checkout', dayjs().format('HH:mm:ss'))
                        .then(item => res.status(200).json(`You have checked out at '${currentTime}'`)) 
                    } else {
                        res.status(400).json('You have already checked out!')
                    }   
                } else if (currentTime >= '09:30' && currentTime <= '16:30') {
                    if(lastUser.checkin !== null && !lastUser.checkout) {
                            db.select('id')
                            .from('check_in_out')
                            .where('id', '=', lastUser.id)
                            .update({
                                checkout: dayjs().format('HH:mm:ss'),
                                description: description
                            })
                            .then(item => res.status(200).json(`You have checked out at '${currentTime}`))                      
                    } else {
                            res.status(400).json('You have already checked out!')
                        }   
                }
                 else {
                     console.log(Boolean(currentTime >= '09:30' && currentTime <= '16:30'))
                 }            


             })
        
        
    




    
}

module.exports = {
    handleCheckOut: handleCheckOut
}