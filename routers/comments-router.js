const commentRouter = require('express').Router();

const {
  updateCommentById,
  removeSelectedCommentById
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
  .delete(removeSelectedCommentById)
  .all(methodNotAllowed)


module.exports = commentRouter;