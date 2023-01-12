const WP = require("../whatsapp/main")
const fs = require('fs')
const util = require("../reader/util")
const DatasReader = require("../reader/reader")
let io = {}

const startSocket = (clientPort, server)=>{
    io = require("socket.io")(server,{
        cors:{
            origin: `https://wawebb-ivanfirmandar.vercel.app`,
            methods : ["GET","POST"]
        }
    })
    console.log("StartSocket!")
    io.on('connection', onConnect)
    io.on('disconnect', onDisconnect)
}
const onConnect = (socket)=>{
    console.log("User Connected!")
    socket.on('getQR', (process)=>{
        console.log('User ID: ' + process)
        try{
            WP.startWAProtocol(io, process)
        }catch(err){
            io.emit('send-error',{
                status : "error",
                message : err,
                clue : "Refresh browser"
            })
        }
    })
    socket.on('readData',(name)=>{
        const datas = DatasReader.getTextFromPDF(name,io)
        console.log("Sending Datas")
    })
    socket.on('save-template',(template)=>{
        console.log(template.text)
        util.writeTemplateText(template.text)
    })
    socket.on('get-template',(template)=>{
        console.log("GET TEMPLATE")
        let rawdata = fs.readFileSync('./template.json');
        let rawdata2 = fs.readFileSync('./image.json');
        let templateFile = JSON.parse(rawdata)
        let imageFile = JSON.parse(rawdata2)
        io.emit('send-template',{
            text : templateFile,
            image : imageFile
        })
    })
    socket.on('sendWA',(datas)=>{
        WP.startSending(io,datas)
    })
}
const onDisconnect = (socket)=>{
    console.log(socket.id)
}

module.exports = startSocket

