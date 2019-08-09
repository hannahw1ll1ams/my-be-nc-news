const {
  selectCommentByIdAndUpdate,
  selectCommentByIdAndRemove
} = require('../models/comments-model')


exports.updateCommentById = (req, res, next) => {
  selectCommentByIdAndUpdate(req.params, req.body)
    .then(comment => {
      let [commentObj] = comment
      res.status(200).send({
        comment: commentObj
      })
    }).catch(err => next(err))
}


exports.removeSelectedCommentById = (req, res, next) => {
  selectCommentByIdAndRemove(req.params).then(response => {
      res.sendStatus(204)
    })
    .catch(err => next(err))
}