const userRouter = require('express').Router()
const {
  getUserByUsername
} = require('../controllers/user-controller')


const {
  methodNotAllowed
} = require('../errors/index')


userRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(methodNotAllowed)


userRouter
  .route('/')
  .all(methodNotAllowed)



module.exports = userRouter;