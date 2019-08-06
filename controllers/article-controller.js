const {
  selectArticle
} = require('../models/articles-model')


exports.getArticleById = (req, res, next) => {
  selectArticle(req.params).then(article => {
    res.status(200).send({
      article
    })
  })
}