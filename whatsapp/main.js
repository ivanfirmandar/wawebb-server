const { Client, ClientInfo, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const fs = require('fs')
const Util = require('../reader/util')
const drawInfos = require('../reader/edit')
let client;
const PhoneStatus = {
    valid_registered : "Valid and Registered",
    valid_notregistered : "Valid but not Registered",
    notvalid : "Not Valid"
}

const startWhatsAppProtocol = (io, id)=>{
    client = new Client({
        puppeteer : {
            headless:true,
        }
    })
    client.on('qr', (qr)=>{
        msg = {
            qr : qr
        }
        console.log(qr)
        io.emit('sendQR',msg)
    })
    try{
        client.on('ready',async ()=>{
            console.log("Client is Ready!")
    
            io.emit('ClientAuthenticated',{
                client : client.info
            })
        })
    }catch(err){
        console.log("RESTART ULANG")
    }
    
    client.on('authenticated',(session)=>{
    })
    client.initialize()
}
const isRegisteredNumber = async (chatID) =>{
    let status;
    try{
        if(chatID != false){
            return await client.isRegisteredUser(chatID) ? PhoneStatus.valid_registered : PhoneStatus.valid_notregistered
        }
    }catch(err){
        return PhoneStatus.notvalid
    }
}


const startSending = async (io, datas)=>{
    let imageurl;
    for (let index = 0; index < datas.length; index++) {
        try {
            let chatID = Util.standarizedFormat(datas[index].phone)
            let registeredUser = await isRegisteredNumber(chatID)
            let success_count, unregistered_count, notvalid_count = 0
            let is_trial = true
            let trial_chatID = "6285171735484@c.us"
            switch (registeredUser) {
                case PhoneStatus.valid_registered:
                    let filename =  await drawInfos(datas[index].image,datas[index].datas)
                    let url = "./temp-images/" + filename
                    let media = MessageMedia.fromFilePath("./temp-images/" + filename)
                    let sending = (is_trial == true) ? await client.sendMessage(trial_chatID,media,{caption:datas[index].message}) : await client.sendMessage(chatID,media,{caption:datas[index].message})
                    console.log(`[${index+1}] Berhasil Mengirim ${datas[index].phone}`)
                    success_count++
                    io.emit("sent_status",{
                        status : 0,
                        id : datas[index]
                    })
                    break;
                case PhoneStatus.valid_notregistered:
                    console.log(`[${index+1}] Nomor tidak terdaftar ${datas[index].phone}`)
                    unregistered_count++
                    io.emit("sent_status",{
                        status : 1,
                        id : datas[index]
                    })
                    break;
                case PhoneStatus.notvalid:
                    console.log(`[${index+1}] Telepon tidak valid ${datas[index].phone}`)
                    notvalid_count++
                    io.emit("sent_status",{
                        status : 2,
                        id : datas[index]
                    })
                    break;
                default:
                    console.log(`[${index+1}] Tidak terdapat nomor Handphone`)
                    io.emit("sent_status",{
                        status : 3,
                        id : datas[index]
                    })
            }
        } catch (error) {
            console.log(error)
        }
        await Util.waitFunc(3000)
        
    }
    io.emit("send-done",{
        status:0,
        message:"success"
    })
     
}

module.exports = {
    startWAProtocol : startWhatsAppProtocol,
    startSending : startSending
}
