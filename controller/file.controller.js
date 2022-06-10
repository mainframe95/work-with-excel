const fs = require('fs');
const { saveExcelData, createFileForUpload } = require('../excel-proccess');
const uploadFile = require("../middleware/upload");
const baseUrl = "localhost:8080/files/"

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    if (req.file) {
      console.log('req.file', req.file);

      await saveExcelData(req.file.path).finally(() => {
        res.status(200).send({
          message: "Uploaded the file successfully: " + req.file.originalname,
        });
      });

    }
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};
const getListFiles = (req, res) => {
  const directoryPath = __basedir + "/resources/static/assets/uploads/";
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }
    let fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });
    res.status(200).send(fileInfos);
  });
};
const download = async (req, res) => {
  if (!['xlsx', 'csv'].includes(req.params.type)){
    res.status(400).send({message: 'xlsx or csv are supported'})
  }
  await createFileForUpload(req.params.type).then(async (fileName) => {
    const directoryPath = __basedir + "/data/output/";
    await res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
  });
};
module.exports = {
  upload,
  getListFiles,
  download,
};