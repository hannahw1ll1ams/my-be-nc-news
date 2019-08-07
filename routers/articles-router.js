const articleRouter = require('express').Router();

const {
  getArticleById,
  updateArticleById
} = require('../controllers/article-controller')

articleRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(updateArticleById);

module.exports = articleRouter;