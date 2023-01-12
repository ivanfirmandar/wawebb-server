const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const { io } = require('socket.io-client');


const getTextFromPDF = async (name, io)=> {
    let path = "./uploads/" + name
    format = {}
    let doc
    try{
        doc = await pdfjsLib.getDocument(path).promise;
    }catch(err){
        console.log(err)
    }
    datas = []
    for (let i = 1; i < doc.numPages+1; i++) {
        let page1 = await doc.getPage(i);
        let content = await page1.getTextContent();
        let strings = content.items.map(function(item) {
            return item.str;
        }
    )
    if(strings.length == 85){
        datas.push({
            no_urut : i,
            no_surat : strings[0],
            plat : strings[2],
            nama : strings[4],
            alamat : strings[6],
            rt_rw : strings[8],
            desa : strings[10],
            kec : strings[12],
            kend : strings[14],
            merk : strings[16],
            tahun : strings[18],
            warna_plat : strings[20],
            warna_ken : strings[22],
            masa_pajak : strings[32],
            masa_stnk : strings[34],
            no_hp : strings[64],
            pkb : strings[68],
            jr : strings[70],
            parkir : strings[72],
            biaya_tot : strings[74],
            no_entri : strings[78].split(" : ")[1]
        });
    }else{
        datas.push({
            no_urut : i,
            no_surat : strings[0],
            plat : strings[2],
            nama : strings[4],
            alamat : strings[6],
            rt_rw : strings[8],
            desa : strings[10],
            kec : strings[12],
            kend : strings[14],
            merk : strings[16],
            tahun : strings[18],
            warna_plat : strings[20],
            warna_ken : strings[22],
            masa_pajak : strings[32],
            masa_stnk : strings[34],
            no_hp : undefined,
            pkb : strings[66],
            jr : strings[68],
            parkir : strings[70],
            biaya_tot : strings[72],
            no_entri : strings[76].split(" : ")[1]
        });
    }
    
    
    }
    io.emit("readData",{
        status : true,
        datas : datas
    })
    
}

module.exports = {
    getTextFromPDF : getTextFromPDF
}