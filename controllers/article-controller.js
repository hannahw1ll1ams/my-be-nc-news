const {
  selectArticle,
  selectArticleAndUpdate
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