const {
  selectUser
} = require('../models/users-model')

exports.getUserByUsername = (req, res, next) => {
  selectUser(req.params).then(([user]) => {
      res.status(200).send({
        user
      })
    })
    .catch(err => next(err));
}