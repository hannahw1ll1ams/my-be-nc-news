const {
  selectUser
} = require('../models/users-model')

exports.getUserByUsername = (req, res, next) => {
  selectUser(req.params).then(user => {
      let [userObj] = user
      res.status(200).send({
        user: userObj
      })
    })
    .catch(err => next(err));
}