/**
 * Below the code for creating my own qr code
 * using node js external module so that we can 
 * import some moudle like qr code
 * 
 * @import(qrcode)
 * @import(fs)
 * */

const QRcode = require('qrcode');
const fs  = require('fs');
const path = require('path');

// Data are URL you want to store into the qr code
 const qrData = 'meganathan212003-4@okhdfcbank';
 console.log(__dirname,'../');


const filePath = '../images';

// Check the folder is exsits or not
if(!fs.existsSync(path.join(__dirname,filePath))){
    fs.mkdirSync(path.join(__dirname,filePath));
    console.log('images folder are created successFully');
}

// file path which mean the qr code path
const qrcodePath = path.join(filePath,'myQrCode.jpeg');

QRcode.toFile(qrcodePath,qrData,(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("QR Code created Successfully");
    }
})