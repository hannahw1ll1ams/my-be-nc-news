const connection = require("../db/connection");


exports.selectUser = ({
  username
}) => {
  return connection
    .from('users')
    .where("username", "=", username)
    .returning("*");
}