const connection = require("../db/connection");


exports.selectUser = ({
  username
}) => {
  return connection
    .from('users')
    .where("username", "=", username)
    .then(user => {
      console.log(user, '<---- model user')
      if (user.length === 0)
        return Promise.reject({
          status: 404,
          msg: "Page Not Found"
        })
      else return user;
    })
}