import { Router } from 'express';
import multer from 'multer';

import * as TodoController from '../controllers/todo.controller';

const allowed = ['image/jpeg' , 'image/jpg' , 'image/png'];

const storageConfig = multer.diskStorage({
    
    destination: (req, file, cb) => {
        if ( allowed.includes(file.mimetype) ) {
            cb(null, './tmp/imagens')
        } else {
            cb(null, './tmp/outros')
        }
    },
    filename: (req, file, cb) => {
        if ( allowed.includes(file.mimetype) ) {
            const extension = file.mimetype.split('/')[1];
           
            cb(null, `images_${ Math.floor(Date.now()) }`)
        } else {

            const extension = file.mimetype.split('/')[1];
            
            cb(null, `outros_${ Math.floor(Date.now()) }`)
        }
    }
}); 
/*const upload = multer({
    storage: storageConfig
}); */

const upload = multer({

    storage: storageConfig,
    fileFilter: (req, file, cb) => {
        cb(null, allowed.includes(file.mimetype));
    },
    limits: {
        fileSize: 2000000,
    }
}); 



const router = Router();

    router.get('/todo', TodoController.all);
    router.get('/todo/:id', TodoController.getOne);
    router.post('/add', TodoController.add);
    router.put('/todo/:id', TodoController.update);
    router.delete('/todo/:id', TodoController.remove);


    router.post('/upload', upload.single('avatar'), TodoController.uploadFile);

export default router;