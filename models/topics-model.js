const connection = require("../db/connection");


exports.selectAllTopics = () => {
  return connection.select('*')
    .from("topics");
}


exports.addNewTopic = ({ slug, description }) => {
  return connection.insert({ slug, description })
    .into('topics')
    .returning('*')
}