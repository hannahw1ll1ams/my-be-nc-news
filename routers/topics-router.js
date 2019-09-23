const topicRouter = require('express').Router()
const {
  getAllTopics,
  postNewTopic
} = require('../controllers/topic-controller')

const {
  methodNotAllowed
} = require('../errors/index')

topicRouter
  .route('/')
  .get(getAllTopics)
  .post(postNewTopic)
  .all(methodNotAllowed);

topicRouter
  .route('/:topic')
  .all(methodNotAllowed);

module.exports = topicRouter;