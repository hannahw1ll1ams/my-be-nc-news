const connection = require("../db/connection");

const { selectAllTopics } = require('../models/topics-model')

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

exports.addArticle = ({ title, topic, username, body }) => {
  const author = username;
  if (typeof (body) === 'number') {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request'
    })
  }
  return connection.insert({ author, title, topic, body })
    .into('articles')
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
  return connection.select('comment_id', 'author', 'votes', 'created_at', 'body').from('comments').where('comments.article_id', '=', article_id).orderBy(sort_by, order).then(comments => {
    return Promise.all([comments, exports.selectArticle({ article_id })])
  })
    .then(([comments]) => comments)
}



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
      return Promise.all([articles, selectAllTopics()])
    })
    .then(response => {
      if (response[0].length === 0 && (response[1].filter(topics => topics.slug === topic).length > 0)) {
        return response[0]
      }
      if (response[0].length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Page Not Found'
        })
      } else return response[0]
    })
}

exports.selectArticleAndRemove = ({ article_id }) => {
  return connection('articles')
    .where('articles.article_id', '=', article_id)
    .del()
    .then(article => {
      if (article === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Page Not Found'
        })
      } else return article
    })
}
