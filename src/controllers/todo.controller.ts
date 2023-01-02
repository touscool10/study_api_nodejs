import { unlink } from 'fs/promises';
import { Request, Response } from 'express';
import { Todo } from '../models/Todo';
import sharp from "sharp";


export const all = async (req: Request, res: Response) => {
    let list = await Todo.findAll({
        order: [
            ['id', 'ASC']
        ]
    });

    if (!list) {
        res.json({ message: "Requisição inválida!" });
    } else if(list.length === 0){
        res.json({ message: "Nenhuma Tarefa encontrada!!" });
    } else {
        res.json({ list });
    }
}

export const add = async (req: Request, res: Response) => {
    let { title } = req.body;
    let message  = "Requisição incompleta!";

    if (title && title !== '') {

        let list = await Todo.create({
            title
        });
        if (!list || !(list.id > 0) ) {
            message  = "Não foi possível Criar a tarefa!";
            res.status(400).json({ message });
        } else {
            message  = "Criada com sucesso!";
            res.status(201).json({ message });
        }

       

    } else {
        res.status(400).json({ message });
    }

}

export const getOne = async (req: Request, res: Response) => {
    let { id } = req.params;
    let message = "Tarefa não encontrada!";

    let task = await Todo.findOne({ 
        where: { 
            id: parseInt(id) 
        } 
    });

    if (!task) {
        res.status(404).json({message});
    }else {
        res.status(302).json({task});
    }
}

export const update = async (req: Request, res: Response) => {
    let { id } = req.params;
    let { title, done } = req.body;

    let message = "Tarefa não encontrada!";

    let task = await Todo.findOne({ 
        where: { 
            id: parseInt(id) 
        } 
    });

    if (!task) {
        res.status(404).json({message});
    } else if( (title === '' || !title) && ( done === undefined || done === null || done == '' ) ) {
        
        message = "Requisição incompleta!";
        res.status(400).json({message});

    } else {
       if (title && title !== '' ) {
            task.title = title;
       }
       if ( done !== undefined && done !== null   ) {
            switch (done.toLowerCase()) {
                case 'true':
                case '1':
                    task.done = true;
                    break;
                case 'false':
                case '0':
                    task.done = false;
                    break;
                default:
                    break;
            }
       }

        await task.save();
        message = "Alterada com sucesso!";

        res.status(200).json({task});
    }
}


export const remove = async (req: Request, res: Response) => {
    let { id } = req.params;

    let message = "Tarefa não encontrada!";  

    let task = await Todo.findOne({ 
        where: { 
            id: parseInt(id) 
        } 
    });

    if (!task) {
        res.status(404).json({message});
    }else {
        await task.destroy();

        message = "Excluida com sucesso!";

        res.status(200).json({message});
    }
}

export const uploadFile = async (req: Request, res: Response) => {

    let file = req.file /*as Express.Multer.File*/ ;

   if (file) {

    const fileName = file.filename + '.jpg' ;

        await sharp(file.path)
        .resize(300, 300, {
            fit: sharp.fit.cover,
            position: 'top'
        })
        .toFormat('jpeg')
        .toFile(`./public/media/${fileName}`) ;


        await unlink(file.path);

        res.json({ image: `${fileName}` });
   } else{
        res.status(400);
        res.json({ error: 'Arquivo inválido!' })
   }
    
}
