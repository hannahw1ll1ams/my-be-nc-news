const articleRouter = require('express').Router();

const {
  getArticleById,
  updateArticleById,
  postArticleComment,
  getCommentsByArticleId,
  sendAllArticles
} = require('../controllers/article-controller')

const {
  methodNotAllowed
} = require('../errors/index')

articleRouter
  .route('/')
  .get(sendAllArticles)
  .all(methodNotAllowed)

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById)
  .all(methodNotAllowed);

articleRouter
  .route('/:article_id/comments')
  .post(postArticleComment)
  .get(getCommentsByArticleId)
  .all(methodNotAllowed)

module.exports = articleRouter;