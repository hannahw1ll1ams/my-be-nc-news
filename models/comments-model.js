const connection = require("../db/connection");

exports.selectCommentByIdAndUpdate = (params, commentBody) => {
  if (!commentBody.inc_votes) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request'
    })
  }
  return connection('comments')
    .where('comments.comment_id', '=', params.comment_id)
    .increment("votes", commentBody.inc_votes)
    .returning('*')
    .then(comments => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Page Not Found"
        })
      } else return comments;
    })
}

exports.selectCommentByIdAndRemove = (params) => {
  return connection('comments')
    .where('comments.comment_id', '=', params.comment_id)
    .del()
    .then(comment => {
      if (comment === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Page Not Found'
        })
      } else return comment
    })
}