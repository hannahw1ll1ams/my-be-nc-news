exports.up = function (connection) {
  console.log('creating comments table...');
  return connection.schema.createTable('comments', (commentsTable) => {
    commentsTable.integer('comment_id').primary();
    commentsTable.string('author').references('users.username');
    commentsTable.integer('article_id').references('articles.article_id');
    commentsTable.integer('votes').defaultsTo(0);
    commentsTable.timestamps('created_at');
    commentsTable.string('body');
  })
};

exports.down = function (connection) {
  console.log('removing comments table...');
  return connection.schema.dropTable('comments');

};