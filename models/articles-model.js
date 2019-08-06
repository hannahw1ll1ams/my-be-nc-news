const connection = require("../db/connection");


exports.selectArticle = ({
  article_id
}) => {
  return connection.from('articles').where("article_id", '=', article_id);
}