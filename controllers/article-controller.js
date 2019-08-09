const {
  selectArticle,
  selectArticleAndUpdate,
  addCommentToArticle,
  selectCommentsByArticleId,
  getAllArticles
} = require('../models/articles-model')


exports.getArticleById = (req, res, next) => {
  selectArticle(req.params).then(([article]) => {
      res.status(200).send({
        article
      })
    })
    .catch(err => next(err));
}


exports.updateArticleById = (req, res, next) => {
  selectArticleAndUpdate(req.body, req.params).then(([article]) => {
      res.status(200).send({
        article
      })
    })
    .catch(err => next(err));
}


exports.postArticleCommentByArticleId = (req, res, next) => {
  addCommentToArticle(req.body, req.params).then(([comment]) => {
      res.status(201).send({
        comment
      })
    })
    .catch(err => next(err))
}


exports.getCommentsByArticleId = (req, res, next) => {
  selectCommentsByArticleId(req.params, req.query).then(comments => {
      res.status(200).send({
        comments
      })
    })
    .catch(err => next(err))
}


exports.sendAllArticles = (req, res, next) => {
  getAllArticles(req.query).then(articles => {
      res.status(200).send({
        articles
      })
    })
    .catch(err => next(err));
}