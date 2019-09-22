const {
  selectAllTopics,
  addNewTopic,
  selectTopicAndRemove
} = require('../models/topics-model')

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then(topics => {
    res.status(200).send({
      topics
    })
  }).catch(err => next(err))
}

exports.postNewTopic = (req, res, next) => {
  addNewTopic(req.body).then(([topic]) => {
    res.status(201).send({
      topic
    })
  })
    .catch(err => next(err))
}

// exports.removeSelectedTopicByTopic = (req, res, next) => {
//   selectTopicAndRemove(req.params).then(response => {
//     res.sendStatus(204)
//   })
//     .catch(err => next(err))
// }