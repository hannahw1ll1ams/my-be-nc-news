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

  return connection('articles').where('article_id', '=', params.article_id).modify(existingQuery => {
    if (update !== undefined) {
      existingQuery.increment("votes", update.inc_votes).returning('*')
    } else {
      return Promise.reject({
        status: 400
      })
    }
  })
  // .then(updatedArticle => {
  //   console.log(updatedArticle, '<---updated article')
  // });
}



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