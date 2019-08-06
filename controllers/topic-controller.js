const {
  selectAllTopics
} = require('../models/topics-model')

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then(topics => {
    //console.log(topics, '<--- topics')
    res.status(200).send({
      topics
    });
  })
}