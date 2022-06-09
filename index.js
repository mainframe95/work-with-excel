// const excel = require("fast-xlsx-reader");
const Excel = require('exceljs');
const path = require("path");
const datadir = path.join(__dirname, "./data");
const input_file = path.join(datadir, "./input/..");
const model = require('./model');
const data = []
const header = {}

var workbook = new Excel.Workbook(); 
workbook.xlsx.readFile(input_file)
    .then(()=> {
        var worksheet = workbook.getWorksheet('Sheet1');
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber)=> {
            if(rowNumber === 1){
                row.values.map(el => header[el.toString().replace(/\s/g, '_')] = undefined)
            }else {
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
    }).finally(async ()=>{
        await model.db().then(async () => {
            // Insert imployee data
            await model.employeClass.bulkCreate(data)
        })
    })
