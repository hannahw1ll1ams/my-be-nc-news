const connection = require("../db/connection");


exports.selectArticle = ({
  article_id
}) => {
  return connection.select('articles.*').from('articles').count('comments.comment_id as comment_count').leftJoin('comments', 'articles.article_id', '=', 'comments.article_id').groupBy('articles.article_id').where("articles.article_id", '=', article_id)
    .then(article => {
      if (article.length === 0)
        return Promise.reject({
          status: 404,
          msg: 'Page Not Found'
        })
      else return article;
    })
}

exports.selectArticleAndUpdate = ({
  inc_votes
}, {
  article_id
}) => {
  return connection('articles')
    .where('article_id', '=', article_id)
    .increment("votes", inc_votes || 0).returning('*')
    .then(updatedArticle => {
      if (updatedArticle.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Page Not Found'
        })
      } else return updatedArticle
    });
}


exports.addCommentToArticle = ({
  username,
  body
}, {
  article_id
}) => {

  const author = username;
  if (typeof (body) === 'number') {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request'
    })
  }
  return connection
    .insert({
      author,
      body,
      article_id
    })
    .into('comments')
    .returning('*')
}



exports.selectCommentsByArticleId = ({
  article_id
}, {
  sort_by = "comments.created_at",
  order = 'desc'
}) => {
  if ((order !== 'asc') && (order !== 'desc')) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request'
    })
  }
  return connection.select('comment_id', 'author', 'votes', 'created_at', 'body').from('comments').where('comments.article_id', '=', article_id).orderBy(sort_by, order)
  .then(comments => {
    console.log(article_id)
    console.log(comments)
    //if article exists with articles id AND has comment count === 0, return []
    //else if article doesn't exist get page not found
    //else return comments
    return Promise.all([comments, selectArticle(article_id)])
      .then(comments => console.log(comments, "<---"))
    if (comments.length === 0) {
      return Promise.reject({
        status: 404,
        msg: 'Page Not Found'
      })
    } else return comments
  })
}

/*
if comments doesn't exist its because article id hasn't found any?
promise.all([comments, selectArticle(article_id)])
.then(comments => return comments)

Original:
exports.selectCommentsByArticleId = ({
  article_id
}, {
  sort_by = "comments.created_at",
  order = 'desc'
}) => {
  if ((order !== 'asc') && (order !== 'desc')) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request'
    })
  }
  return connection.select('comment_id', 'author', 'votes', 'created_at', 'body').from('comments').where('comments.article_id', '=', article_id).orderBy(sort_by, order).then(comments => {
    console.log(!comments)
    console.log(comments)
    //if article exists with articles id AND has comment count === 0, return []
    //else if article doesn't exist get page not found
    //else return comments
    if (comments.length === 0) {
      return Promise.reject({
        status: 404,
        msg: 'Page Not Found'
      })
    } else return comments
  })
}

*/




exports.getAllArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic
}) => {
  if ((order !== 'asc') && (order !== 'desc')) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request'
    })
  }
  return connection
    .select('articles.*')
    .from('articles')
    .count('comments.comment_id as comment_count').leftJoin('comments', 'articles.article_id', '=', 'comments.article_id').groupBy('articles.article_id')
    .orderBy(sort_by, order)
    .modify(articleQuery => {
      if (author !== undefined) {
        articleQuery.where("articles.author", '=', author)
      }
      if (topic !== undefined) {
        articleQuery.where('articles.topic', '=', topic)
      }
    })
    .then(articles => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 400,
          msg: 'Bad Request'
        })
      } else return articles
    })
}