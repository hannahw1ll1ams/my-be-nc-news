const connection = require("../db/connection");


exports.selectUser = ({
  username
}) => {
  return connection
    .from('users')
    .where("username", "=", username)
    .then(user => {
      if (user.length === 0)
        return Promise.reject({
          status: 404,
          msg: "Page Not Found"
        })
      else return user;
    })
}

exports.addNewUser = ({ username, avatar_url, name }) => {
  return connection.insert({ username, avatar_url, name })
    .into('users')
    .returning('*')
}

exports.fetchAllUsers = () => {
  return connection.select('username', 'avatar_url', 'name')
    .from('users')
}