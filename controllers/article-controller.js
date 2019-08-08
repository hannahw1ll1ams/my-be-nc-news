const {
  selectArticle,
  selectArticleAndUpdate,
  addCommentToArticle,
  selectCommentsByArticleId
} = require('../models/articles-model')


exports.getArticleById = (req, res, next) => {
  selectArticle(req.params).then(article => {
      res.status(200).send({
        article
      })
    })
    .catch(err => next(err));
}


exports.updateArticleById = (req, res, next) => {
  // console.log(req.body, '<--- req.body')
  // console.log(req.params, '<--- req params')
  selectArticleAndUpdate(req.body, req.params).then(article => {
      // console.log(article, '<--- article')
      res.status(201).send({
        article
      })
    })
    .catch(err => next(err));
}


exports.postArticleComment = (req, res, next) => {
  //console.log(req.body, "<---req.body, added comment details")
  //console.log(req.params, "<---req.params")

  addCommentToArticle(req.body, req.params).then(comment => {
      //console.log(comment, "<---comment in controller")
      res.status(201).send({
        comment
      })
    })
    .catch(err => next(err))
}


exports.getCommentsByArticleId = (req, res, next) => {
  console.log(req.params, "<--- req.params")
  console.log(req.query, "<--- req.query")

  selectCommentsByArticleId(req.params, req.query).then(comments => {
      console.log(comments, '<--- comments in controller')
      res.status(200).send({
        comments
      })
    })
    .catch(err => next(err))
}