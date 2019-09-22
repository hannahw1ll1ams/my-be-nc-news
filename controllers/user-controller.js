const {
  selectUser,
  addNewUser,
  fetchAllUsers
} = require('../models/users-model')

exports.getUserByUsername = (req, res, next) => {
  selectUser(req.params).then(([user]) => {
    res.status(200).send({
      user
    })
  })
    .catch(err => next(err));
}

exports.postNewUser = (req, res, next) => {
  addNewUser(req.body).then(([user]) => {
    res.status(201).send({
      user
    })
  })
    .catch(err => next(err))
}

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers().then((users) => {
    res.status(200).send({
      users
    })
  })
    .catch(err => next(err))
}