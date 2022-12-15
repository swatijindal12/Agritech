import {Request,Response,NextFunction} from 'express'
// route to      => api/v1/test
exports.setup = (req: Request,res: Response,next:NextFunction) => {
    return res.status(200).json({
        success : true,
        message : "working !"
    })
} 