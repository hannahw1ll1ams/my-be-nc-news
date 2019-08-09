const connection = require("../db/connection");


exports.selectArticle = ({
  article_id
}) => {
  return connection.select('articles.*').from('articles').count('comments.comment_id as comment_count').leftJoin('comments', 'articles.article_id', '=', 'comments.article_id').groupBy('articles.article_id').where("articles.article_id", '=', article_id)
    .then(article => {
      // console.log(article, "<--- article")
      if (article.length === 0)
        return Promise.reject({
          status: 404,
          msg: 'Page Not Found'
        })
      else return article;
    })
}

exports.selectArticleAndUpdate = (update, params) => {
  // console.log(params, "model params")
  //console.log(update.inc_votes, "request body.inc votes")
  if (!update.inc_votes) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request'
    })
  }
  return connection('articles')
    .where('article_id', '=', params.article_id)
    .increment("votes", update.inc_votes).returning('*')
    .then(updatedArticle => {
      if (updatedArticle.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Page Not Found'
        })
      } else return updatedArticle
    });
  //NOT WHERE MODIFY SHOULD BE USED
}



exports.addCommentToArticle = (newComment, params) => {
  const {
    username,
    body
  } = newComment;

  const author = username;
  const newDate = Date.now();
  const created_at = new Date(newDate);

  const {
    article_id
  } = params

  //console.log(article_id)
  //console.log(newComment.body, "<--- model req.body.body")
  //console.log(params, "<--- model params")

  //need to think how else can violate schema
  if (typeof (newComment.body) === 'number') {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request'
    })
  }

  if ((!newComment.body) || (!newComment.username)) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request"
    })
  }

  return connection
    .insert({
      author,
      body,
      article_id,
      created_at
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
  // console.log(article_id, "<-- article_id in model")
  // console.log(sort_by, "<-- sort_by in model")
  // console.log(order, "<-- order in model")

  if ((order != 'asc') && (order != 'desc')) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request'
    })
  }

  return connection.select('comment_id', 'author', 'votes', 'created_at', 'body').from('comments').where('comments.article_id', '=', article_id).orderBy(sort_by, order).then(comments => {
    if (comments.length === 0) {
      return Promise.reject({
        status: 404,
        msg: 'Page Not Found'
      })
    } else return comments
  })
}


// exports.getAllArticles = () => {
//   return connection
//     .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes', 'comment_count')
//     .from('articles')
//     .count('comments.comment_id as comment_count')
//     .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
//     .groupBy('articles.article_id')

// }

exports.getAllArticles = ({
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic
}) => {

  if ((order != 'asc') && (order != 'desc')) {
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
      if (author != undefined) {
        articleQuery.where("articles.author", '=', author)
      }
      if (topic != undefined) {
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


// 


//This works in sql
// SELECT article_id, title FROM articles;

// SELECT comment_id, article_id, author FROM comments;

// SELECT articles.article_id, articles.title, COUNT(comments.comment_id) AS comment_count FROM articles
// LEFT JOIN comments ON articles.article_id = comments.article_id
// GROUP BY articles.article_id;



//EXAMPLE
// --SELECT houses.house_id, house_name, COUNT(wizards.wizards_id) AS student_count FROM HOUSES
//   --LEFT JOIN wizards ON houses.house_id = wizards.house_id
//   --GROUP BY houses.house_id;


// Translated
//
// return connection.select('houses.*').from('houses').count('wizards.wizard_id as student_count').leftJoin('wizards', 'houses.house_id', '=', 'wizards.house_id').groupBy('houses.house_id').orderBy()