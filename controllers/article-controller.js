const {
  selectArticle,
  selectArticleAndUpdate,
  addCommentToArticle,
  selectCommentsByArticleId,
  getAllArticles
} = require('../models/articles-model')


exports.getArticleById = (req, res, next) => {
  selectArticle(req.params).then(article => {
      let [articleObj] = article
      res.status(200).send({
        article: articleObj
      })
    })
    .catch(err => next(err));
}


exports.updateArticleById = (req, res, next) => {
  // console.log(req.body, '<--- req.body')
  // console.log(req.params, '<--- req params')
  selectArticleAndUpdate(req.body, req.params).then(article => {
      let [articleObj] = article
      // console.log(article, '<--- article')
      res.status(200).send({
        article: articleObj
      })
    })
    .catch(err => next(err));
}


exports.postArticleCommentByArticleId = (req, res, next) => {
  //console.log(req.body, "<---req.body, added comment details")
  //console.log(req.params, "<---req.params")

  addCommentToArticle(req.body, req.params).then(comment => {
      //console.log(comment, "<---comment in controller")
      let [commentObj] = comment
      res.status(201).send({
        comment: commentObj
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


exports.sendAllArticles = (req, res, next) => {
  getAllArticles(req.query).then(articles => {
      //console.log(articles, "<--- articles in controller")
      res.status(200).send({
        articles
      })
    })
    .catch(err => next(err));
}