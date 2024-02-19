import multer from "multer";

//storage (location and filename)
const storage =multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./uploadedFiles')
    },
    filename:(req,file,callback)=>{
        callback(null,`image-${Date.now()}-${file.originalname}`)
    }
})

//file filter (format of files)
const fileFilter = (req, file, callback) => {
    if (file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        callback(null, true)
    }
    else {
        callback(null, false)
    }
}

//multer middleware
const fileUploads=multer({storage,fileFilter})
export default fileUploads;