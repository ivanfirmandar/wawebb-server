const express = require('express');
const app = express();
const multer = require("multer")
const path = require('path')
const Config = require("./config.json");
const http = require('http');
const startSocket = require("./socket/socket");
const { Util } = require('pdfjs-dist');
const Writer = require('./reader/util')
const server = http.createServer(app);

const diskStoragePdf = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, path.join(__dirname, '/uploads/'));
  },
  filename: function(req,file,cb){
    cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  }
})

const diskStorageImage = multer.diskStorage({
  destination: function(req,file,cb){
    cb(null, path.join(__dirname, '/images/'));
  },
  filename: function(req,file,cb){
    cb(null,file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  }
})
app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'https://wawebb-ivanfirmandar.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use('/images',express.static('images'))


const fileHandler = (req,res)=>{
  console.log("on Upload!" + Date.now())
  const file = req.file
  if(!file){
    res.status(400).send({
      status:false,
      data: "no File is selected"
    })
  }
  console.log("Sending response...")
  console.log(file)
  if (file.fieldname == 'theimage') {
    Writer.writeTemplateImage(file)
  }
  res.send({
    status : true,
    data : file
  })
}


app.post("/upload/pdfdata",multer({storage:diskStoragePdf}).single("thepdf"), fileHandler)
app.post("/upload/image",multer({storage:diskStorageImage}).single("theimage"), fileHandler)


startSocket(Config.clientPort, server)

server.listen(Config.serverPort, () => {
  console.log(`listening on: ${Config.serverPort}`);
});