const Canvas = require('canvas');
const fs = require('fs')

async function drawData(imageurl, datas) {
    const img = await Canvas.loadImage('./images/' + imageurl)
    const ratio = img.height / img.width
    const c = Canvas.createCanvas(1000, ratio*1000)
    const ctx = c.getContext("2d")
    const factor = 20.5
    const initial_num = 329
    ctx.drawImage(img,0,0, c.width, c.height);
    ctx.font = "bold 14pt 'PT Sans'"
    switch (datas.no_surat.split("\/")[1]) {
        case "SPOS":
            ctx.fillText("SURAT PENDATAAN SUBJEK DAN OBJEK",550,80)
            break;
        case "NPP":
            ctx.fillText("NOTA PERHITUNGAN",640,80)
            break;
        default:
            ctx.fillText("NOTA TAGIHAN",670,80)
            break;
    }
    
    ctx.font = "normal 11pt 'PT Sans'"
    ctx.fillText(datas.no_surat,130,288)
    ctx.fillText(datas.plat,250,initial_num)
    ctx.fillText(datas.nama,250,initial_num + factor)
    ctx.fillText(datas.alamat,250,initial_num + 2*factor)
    ctx.fillText(datas.rt_rw,250,initial_num + 3*factor)
    ctx.fillText(datas.desa,250,initial_num + 4*factor)
    ctx.fillText(datas.kec,250,initial_num + 5*factor)
    ctx.fillText(datas.kend,250,initial_num + 6*factor)
    ctx.fillText(datas.merk,250,initial_num + 7*factor)
    ctx.fillText(datas.tahun,250,initial_num + 8*factor)
    ctx.fillText(datas.warna_plat,250,initial_num + 9*factor)
    ctx.fillText(datas.warna_ken,250,initial_num + 10*factor)
    ctx.fillText(datas.masa_pajak,750,263)
    ctx.fillText(datas.masa_stnk,750,285)
    ctx.font = "normal 20pt 'PT Sans'"
    ctx.fillText(datas.biaya_tot,680,400)
    const buffer = c.toBuffer('image/jpeg')
    const directory = "./temp-images/"
    const filename = "readytosend-" + Math.floor(Math.random() * 1000000) + ".jpg";
    fs.writeFileSync(directory + filename,buffer)
    return filename
}

module.exports = drawData