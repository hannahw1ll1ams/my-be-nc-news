const connection = require("../db/connection");

exports.selectAllTopics = () => {
  return connection.select('*')
    .from("topics")
  // .then(topics => {
  //   if (topics.length === 0) {
  //     return Promise.reject({
  //       status: 404,
  //       msg: 'Page Not Found'
  //     })
  //   } else return topics
  // })
}


exports.addNewTopic = ({ slug, description }) => {
  return connection.insert({ slug, description })
    .into('topics')
    .returning('*')
}