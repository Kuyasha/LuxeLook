
import multer from "multer";

//we have to keep this fn name as storage else this middleware will not work
const storage = multer.diskStorage({
    filename: function(req, file, callback){
        callback(null, file.originalname)
    }
});

const upload = multer({storage});

export default upload;
