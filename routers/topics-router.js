const topicRouter = require('express').Router()
const {
  getAllTopics
} = require('../controllers/topic-controller')

//console.log('topics router')

topicRouter.route('/').get(getAllTopics)


module.exports = topicRouter;