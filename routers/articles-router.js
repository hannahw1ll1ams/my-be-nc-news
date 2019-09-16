const articleRouter = require('express').Router();

const {
  getArticleById,
  updateArticleById,
  postArticleCommentByArticleId,
  getCommentsByArticleId,
  sendAllArticles,
  postArticle,
  removeSelectedArticleById
} = require('../controllers/article-controller')

const {
  methodNotAllowed
} = require('../errors/index')

articleRouter
  .route('/')
  .get(sendAllArticles)
  .post(postArticle)
  .all(methodNotAllowed)

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById)
  .delete(removeSelectedArticleById)
  .all(methodNotAllowed);

articleRouter
  .route('/:article_id/comments')
  .post(postArticleCommentByArticleId)
  .get(getCommentsByArticleId)
  .all(methodNotAllowed)

module.exports = articleRouter;