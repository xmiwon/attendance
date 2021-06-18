const handleDownloadReport = (req, res, db, dayjs, ExcelJS) => {
  const fs = require('fs'),
        workbook = new ExcelJS.Workbook(),
        worksheet = workbook.addWorksheet("My Sheet");
  worksheet.columns = [
    {header: 'ID', key: 'id', width: 10},
    {header: 'USER', key: 'user', width: 35},
    {header: 'IN', key: 'in', width: 20}, 
    {header: 'OUT', key: 'out', width: 20}, 
    {header: 'DATE', key: 'date', width: 15},
    {header: 'REASON', key: 'reason', width: 100}
  ];

    db.select(
        'check_in_out.id',
        'users_list.username',
          'check_in_out.checkin',
           'check_in_out.checkout',
            'check_in_out.description',
             'check_in_out.date'
             )
    .from('check_in_out')
    .innerJoin('users_list', 'check_in_out.user_id', 'users_list.id')
    .then(data => {
        const sortDataById = data
        sortDataById.sort((a, b) => a.id - b.id)
        try {
            sortDataById.map((item) => {
            worksheet.addRow(
                {
                    id: item.id, 
                    user: item.username,
                    in: item.checkin,
                    out: item.checkout,
                    reason: item.description,
                    date: item.date
                });
            })
            const filePath = `${process.env.USERPROFILE}/Downloads/report.xlsx`;
            workbook.xlsx.writeFile(filePath);
            res.status(200).json(`File downloaded to the "Downloads" folder.`)   
        }
        catch {
            res.status(400).json('Failed to download. Try again.')
        }
            
    })


}


module.exports = {
    handleDownloadReport: handleDownloadReport
}