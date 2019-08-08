const connection = require("../db/connection");






exports.selectCommentByIdAndUpdate = (params, commentBody) => {
  // console.log(params.comment_id, "<-- commentID");
  // console.log(commentBody.inc_votes, "<-- commentBody.inc_votes");

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
  console.log(params.comment_id)
  return connection('comments')
    .where('comments.comment_id', '=', params.comment_id)
    .del()
    .then(comment => {
      console.log(comment)
      if (comment === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Page Not Found'
        })
      } else return comment
    })
}

/* 
200 - get
201 - post


*/