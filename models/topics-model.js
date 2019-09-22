const connection = require("../db/connection");
const { getAllArticles } = require('../models/articles-model')

exports.selectAllTopics = () => {
  return connection.select('*')
    .from("topics")
    .then(topics => {
      if (topics.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Page Not Found'
        })
      } else return topics
    })
}


exports.addNewTopic = ({ slug, description }) => {
  return connection.insert({ slug, description })
    .into('topics')
    .returning('*')
}

// exports.selectTopicAndRemove = ({ topic }) => {
//   //if a topic has articles then don't delete
//   //if a topic exists but doesn't have any articles then delete

//   //looking to see if there are any articles on a topic
//   exports.getAllArticles(topic)
//     //only if there are articles are on topic will anything come back
//     .then(articles => {
//       //if there are articles on a topic then can't delete this topic.
//       if (articles.length > 0 {
//         return Promise.reject({
//           status: 400,
//           msg: 'Bad Request, cannot delete a topic that has articles'
//         })
//       })
//       //if 
//       else {
//     return connection('topics')
//       .where('topics.slug', '=', topic)
//       .del()
//       .then(topic => {
//         if (topic === 0) {
//           return Promise.reject({
//             status: 404,
//             msg: 'Page Not Found'
//           })
//         } else return topic
//       })
//   }
// })
// }