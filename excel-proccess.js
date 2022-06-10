'use strict'

const Excel = require('exceljs');
const model = require('./model');
const path = require("path");
const datadir = path.join(__dirname, "./data/output");

async function saveExcelData(input_file) {
    const data = []
    const header = {}
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(input_file)
        .then(() => {
            var worksheet = workbook.getWorksheet('Sheet1');
            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                if (rowNumber === 1) {
                    row.values.map(el => header[el.toString().replace(/\s/g, '_')] = undefined)
                } else {
                    let i = 1;
                    for (const key in header) {
                        if (header.hasOwnProperty.call(header, key)) {
                            header[key] = row.values[i] ? row.values[i] : null
                        }
                        i++;
                    }
                    data.push(JSON.parse(JSON.stringify(header)));
                }
            });
        }).finally(async () => {
            await model.db().then(async () => {
                console.log('data...', data.length);
                // Insert imployee data
                await model.employeClass.bulkCreate(data);
            })
        })

}

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
            worksheet.addRow({ ...e })
        })

        // Keep in mind that reading and writing is promise based.
        const file = path.join(datadir, name);
        if (type === 'csv') {
            return workbook.csv.writeFile(file + '.csv').then(e => name + '.csv')
        } else {
            return workbook.xlsx.writeFile(file + '.xlsx').then(e => name + '.xlsx')
        }


    }
}

async function createFileForUpload(type) {
    return await model.db().then(async (name) => {
        const data = await model.employeClass.findAll({ attributes: { exclude: ['id'] } })
        const employee_outputs = data.map(obj => obj.dataValues)
        return await createExcelFile(new Date().getTime().toString(), employee_outputs, type)
    })

}

module.exports = { saveExcelData, createFileForUpload }