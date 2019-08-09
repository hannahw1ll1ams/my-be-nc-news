const {
  selectUser
} = require('../models/users-model')

exports.getUserByUsername = (req, res, next) => {
  // console.log(req.params)

  selectUser(req.params).then(user => {
      //console.log(user, '<---- controller user')
      let [userObj] = user
      res.status(200).send({
        user: userObj
      })
    })
    .catch(err => next(err));
}