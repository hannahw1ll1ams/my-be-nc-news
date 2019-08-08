const articleRouter = require('express').Router();

const {
  getArticleById,
  updateArticleById,
  postArticleComment,
  getCommentsByArticleId
} = require('../controllers/article-controller')

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById);

articleRouter
  .route('/:article_id/comments')
  .post(postArticleComment)
  .get(getCommentsByArticleId)

module.exports = articleRouter;