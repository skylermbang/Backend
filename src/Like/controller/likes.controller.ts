import Controller from "../../Infrastructures/interfaces/controller.interface"
import { Router, Request, Response, NextFunction } from 'express'
import authenticate from "../../Infrastructures/middlewares/authentication.middleware"
import validate from "../../Infrastructures/middlewares/validation.middleware"
import createValidator from '../validators/createLike.validator'
import deleteValidator from "../validators/deleteLike.validator"
import PromiseRejectionException from '../../Infrastructures/exceptions/PromiseRejection.exception'
import Create from '../services/like.create'
import Delete from '../services/like.delete'

export default class BookmarksController implements Controller {
    public readonly path = '/posts/:postId/like'
    public readonly router = Router()
  
    constructor() {
      this.initializeRoutes()
    }
  
    private initializeRoutes() {
      this.router
        .route(this.path)
        .post( validate(createValidator), this.createLike)

      this.router
        .route(this.path + '/:likeId')
        .delete(this.deleteLike)
    }

    private createLike(req: Request, res: Response, next: NextFunction) {
        const createDTO: createValidator = {
            nickname: req.body.nickname,
            postId: Number(req.body.postId)
        }

        return Create(createDTO)
            .then((like) => like && res.status(201).json({ isCreated: true }))
            .catch((err) => {
                console.error(err)
                next(new PromiseRejectionException())
              })
    }

    private deleteLike(req: Request, res: Response, next: NextFunction) {
        const deleteDTO: deleteValidator = {
            likeId: Number(req.params.postId)
        }

        return Delete(deleteDTO)
            .then(() => res.status(201).json({ isDeleted: true }))
            .catch((err) => {
                console.error(err)
                next(new PromiseRejectionException())
            })
    }
}