const userRouter = require('express').Router()
const {
  getUserByUsername,
  postNewUser,
  getAllUsers
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
  .post(postNewUser)
  .get(getAllUsers)
  .all(methodNotAllowed)


module.exports = userRouter;