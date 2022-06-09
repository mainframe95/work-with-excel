'use strict'

const Excel = require('exceljs');
const model = require('./model');
const path = require("path");
const datadir = path.join(__dirname, "./data/output");


function createExcelFile(name = '', data = [], type = '') {
    if (data.length > 0) {
        let workbook = new Excel.Workbook()
        let worksheet = workbook.addWorksheet(name)
        const columns = []
        for (const key in data[0]) {
            columns.push({ header: key.replace(/\_/g, ' '), key })
        }

        worksheet.columns = columns

        worksheet.columns.forEach(column => {
            column.width = column.header.length < 12 ? 12 : column.header.length
        })

        // Make the header bold.
        // Note: in Excel the rows are 1 based, meaning the first row is 1 instead of 0.
        worksheet.getRow(1).font = { bold: true }

        // Dump all the data into Excel or CSV
        data.forEach((e, index) => {
            // row 1 is the header.
            const rowIndex = index + 2
            worksheet.addRow({...e})
        })

        // Keep in mind that reading and writing is promise based.
        const file = path.join(datadir, name);
        if (type === 'csv') {
            workbook.csv.writeFile(file + '.csv')
        } else {
            workbook.xlsx.writeFile(file + '.xlsx')
        }

    }
}

model.db().then(async () => {
    const data = await model.employeClass.findAll({ attributes: { exclude: ['id'] } })
    const employee_outputs = data.map(obj => obj.dataValues)
    createExcelFile(new Date().getTime().toString(), employee_outputs, 'excel')
})

