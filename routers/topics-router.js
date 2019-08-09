const topicRouter = require('express').Router()
const {
  getAllTopics
} = require('../controllers/topic-controller')

const {
  methodNotAllowed
} = require('../errors/index')

topicRouter
  .route('/')
  .get(getAllTopics)
  .all(methodNotAllowed);

topicRouter
  .route('/:username')
  .all(methodNotAllowed);

module.exports = topicRouter;