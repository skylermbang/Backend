import express, { Request, Response, NextFunction } from 'express'
import Controller from '../../Infrastructures/interfaces/controller.interface'
import PromiseRejectionException from '../../Infrastructures/exceptions/PromiseRejection.exception'
import validate from '../../Infrastructures/middlewares/validation.middleware'
/* validators */
import createValidator from '../validators/createQuestion.validator'
import updateValidator from '../validators/updateQuestion.validator'
import deleteValidator from '../validators/deleteDetail.validator'
import createAnswerValidator from '../validators/createAnswers.validator'
import readDetailValidator from '../validators/readDetail.validator'
/* services */
import AnswersCreate from '../services/answers.create'
import AnswersRead from '../services/answers.read'
import Create from '../services/questions.create'
import Read from '../services/questions.read'
import DetailRead from '../services/detail.read'
import Update from '../services/question.update'
import Delete from '../services/question.delete'

export default class QuestionsController implements Controller {
  public readonly path = '/questions'
  public readonly answerPath = '/questions/:questionId/answers'
  public readonly router = express.Router()

  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router
      .route(this.path)
      .get(this.readQuestions)
      .post(validate(createValidator), this.createQuestion)

    this.router
      .route(this.path + '/:questionId')
      .get(this.readDetail)
      .patch(validate(updateValidator), this.updateQuestion)
      .delete(this.deleteQuestion)

    this.router
      .route(this.answerPath)
      .post(validate(createAnswerValidator), this.createAnswer)
      .get(this.readAnswer)
  }

  private readQuestions(req: Request, res: Response, next: NextFunction) {
    return Read()
      .then((questions) => res.status(200).json(questions))
      .catch((err) => {
        console.error(err)
        next(new PromiseRejectionException())
      })
  }

  private createQuestion(req: Request, res: Response, next: NextFunction) {
    const createDTO: createValidator = {
      title: req.body.title,
      content: req.body.content,
      nickname: req.body.nickname
    }

    return Create(createDTO)
      .then(() => res.status(201).json({ isCreated: true }))
      .catch((err) => {
        console.error(err)
        next(new PromiseRejectionException())
      })
  }

  private readDetail(req: Request, res: Response, next: NextFunction) {
    const readDTO = {
      questionId: Number(req.params.questionId)
    }

    return DetailRead(readDTO)
      .then((questions) => res.status(200).json(questions))
      .catch((err) => {
        console.error(err)
        next(new PromiseRejectionException())
      })
  }

  private updateQuestion(req: Request, res: Response, next: NextFunction) {
    const updateDTO: updateValidator = {
      questionId: req.body.questionId,
      title: req.body.title,
      content: req.body.content
    }

    return Update(updateDTO)
      .then(() => res.status(200).json({ isUpdated: true }))
      .catch((err) => {
        console.error(err)
        next(new PromiseRejectionException())
      })
  }

  private deleteQuestion(req: Request, res: Response, next: NextFunction) {
    const deleteDTO = {
      questionId: Number(req.params.questionId)
    }

    return Delete(deleteDTO)
      .then(() => res.status(200).json({ isDeleted: true }))
      .catch((err) => {
        console.error(err)
        next(new PromiseRejectionException())
      })
  }

  private createAnswer(req: Request, res: Response, next: NextFunction) {
    const createDTO: createAnswerValidator = {
      content: req.body.content,
      nickname: req.body.nickname,
      questionId: req.body.questionId
    }
    console.log(createDTO.questionId)
    return AnswersCreate(createDTO)
      .then(() => res.status(201).json({ isCreated: true }))
      .catch((err) => {
        console.error(err)
        next(new PromiseRejectionException())
      })
  }

  private readAnswer(req: Request, res: Response, next: NextFunction) {
    return AnswersRead()
      .then((answers) => res.status(200).json(answers))
      .catch((err) => {
        console.error(err)
        next(new PromiseRejectionException())
      })
  }
}