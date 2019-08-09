exports.up = function (connection) {
  console.log('creating users table...');
  return connection.schema.createTable('users', (usersTable) => {
    usersTable.string('username').primary().unique().notNullable();
    usersTable.string('avatar_url').notNullable();
    usersTable.string('name').notNullable();
  })
};

exports.down = function (connection) {
  console.log('removing users table...');
  return connection.schema.dropTable('users')

};