const apiRouter = require('express').Router();
const topicRouter = require('./topics-router.js')
const userRouter = require('./users-router')
const articleRouter = require('./articles-router')

//console.log('api router')

apiRouter.use('/topics', topicRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/articles', articleRouter);

apiRouter.all('/*', (req, res, next) => res.status(404).send({
  msg: 'Page Not Found'
}));
//make this a function
//put in other router files as well 

module.exports = apiRouter;