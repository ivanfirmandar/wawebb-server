const fs = require('fs')

const util = {
    writeTemplateText : (text)=>{
        const textObj = {
            text : text
        }

        var json = JSON.stringify(textObj)
        console.log(json)
        fs.writeFile('template.json',json,'utf8',(e)=>{
            console.log(e)
        })
    },
    writeTemplateImage : (file)=>{
        const urlObj = file
        var json = JSON.stringify(urlObj)
        console.log(json)
        fs.writeFile('image.json',json,'utf8',(e)=>{
            console.log(e)
        })
    },
    waitFunc : (i)=>{
        return new Promise(resolve=>setTimeout(resolve,i))
    },
    standarizedFormat : (nomor)=>{
        const standard = "@c.us"
        if (nomor == undefined) {
            return false
        }
        switch (nomor[0]) {
            case "0":
                return "62" + nomor.substring(1) + standard
            case "6":
                return nomor + standard;
            case "+":
                return nomor.substring(1) +standard;
            case "8":
                return "62" + nomor + standard;
            default:
                return false
        }
    }
    
}

module.exports = util