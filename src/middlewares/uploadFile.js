const multer = require('multer')

exports.uploadFile = (imageFile) => {
    //konfigurasi penyimpanan dan perubahan nama file
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads")
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, ""))
        }
    })

    //konfigurasi jenis file
    const fileFilter = (req, file, cb) => {
        //pengecekan apakah ada file atau tidak
        if (file.fieldname == imageFile) {
            if (!file.originalname.match(/\.(jpg|JPG|png|PNG|jpeg|JPEG)$/)) {
                req.fileValidationError = {
                    message: 'Only image files are allowed'
                }
                return cb(new Error("Only image files are allowed"), false)
            }
        }
        cb(null, true)
    }

    //konfigurasi ukuran file
    const sizeInMB = 10
    const maxSize = sizeInMB * 1000 * 1000

    const upload = multer({
        storage,
        fileFilter,
        limits:{
            fileSize: maxSize
        }
    }).single(imageFile)

    // konfigurasi multer middleware
    return (req,res,next)=>{
        upload(req,res, (err)=>{
            // validasi gagal
            if(req.fileValidationError){
                return res.status(400).send(req.fileValidationError)
            }

            //file tidak ada yg terupload
            if(!req.file && !err){
                return res.status(400).send({
                    message: 'Please select file to upload'
                })
                
            }
            
            //file bablas
            if(err){
                if(err.code === 'LIMIT_FILE_SIZE'){
                    return res.status(400).send({
                        message: 'Max file size 10 MB'
                    })
                }
                return res.status(400).send(err)
            }

            //lanjut ke proses selanjutnya
            next()
        })
    }
}