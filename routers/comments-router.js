const commentRouter = require('express').Router();

const {
  updateCommentById
} = require('../controllers/comment-controller')

const {
  methodNotAllowed
} = require('../errors/index')

commentRouter
  .route('/')
  .all(methodNotAllowed)


commentRouter
  .route('/:comment_id')
  .patch(updateCommentById)
  .all(methodNotAllowed)


module.exports = commentRouter;