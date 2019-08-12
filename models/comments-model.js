const connection = require("../db/connection");

exports.selectCommentByIdAndUpdate = ({
  comment_id
}, {
  inc_votes
}) => {


  return connection('comments')
    .where('comments.comment_id', '=', comment_id)
    .increment("votes", inc_votes || 0)
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

exports.selectCommentByIdAndRemove = ({
  comment_id
}) => {
  return connection('comments')
    .where('comments.comment_id', '=', comment_id)
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