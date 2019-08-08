const {
  selectCommentByIdAndUpdate
} = require('../models/comments-model')


exports.updateCommentById = (req, res, next) => {
  // console.log(req.params, '<-- req.params')
  // console.log(req.body, '<-- req.body')
  selectCommentByIdAndUpdate(req.params, req.body)
    .then(comment => {
      let [commentObj] = comment
      res.status(200).send({
        comment: commentObj
      })
    }).catch(err => next(err))
}