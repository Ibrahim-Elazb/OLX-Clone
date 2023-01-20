const multer = require("multer");
const path = require("path");
const fs=require("fs");
const { v4: uuidv4 } = require('uuid');

const multerValidFileTypes={image:["image/png","image/jpg","image/jpeg"],pdf:"application/pdf"}

const multerUpload = (validFileTypes,storagePath) => {
    if(!storagePath){
        storagePath="../general";
    }
    
    if(!fs.existsSync(path.join(__dirname,`../${storagePath}`))){
        fs.mkdirSync(path.join(__dirname,`../${storagePath}`),{recursive:true});
    }
    const fileStorage = multer.diskStorage({
        destination: (request, file, callBackHandler) => {
            callBackHandler(null, path.join(__dirname,`../${storagePath}`))
        },
        filename:(request,file,callBackHandler)=>{
            callBackHandler(null,uuidv4()+file.originalname)
        }
    })

    const fileFilter=(request,file,callBackHandler)=>{
        if(validFileTypes?.includes(file.mimetype)){
            callBackHandler(null,true)
        }else{
            console.log("invalid file type")
            callBackHandler(new Error("invalid file type"),false)
        }
    }

    return multer({storage:fileStorage,fileFilter})
}

module.exports={multerValidFileTypes,multerUpload}