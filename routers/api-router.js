const apiRouter = require('express').Router();
const topicRouter = require('./topics-router.js')
const userRouter = require('./users-router')
const articleRouter = require('./articles-router')
const commentRouter = require('./comments-router')
const getAllApiEndpoints = require('../controllers/endpoints-controller')

apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentRouter)
apiRouter.get('/', getAllApiEndpoints)

apiRouter.all('/*', (req, res, next) => res.status(404).send({
  msg: 'Page Not Found'
}));

module.exports = apiRouter;