const topicRouter = require('express').Router()
const {
  getAllTopics
} = require('../controllers/topic-controller')

const {
  methodNotAllowed
} = require('../errors/index')


//console.log('topics router')

topicRouter
  .route('/')
  .get(getAllTopics)
  .all(methodNotAllowed);



module.exports = topicRouter;