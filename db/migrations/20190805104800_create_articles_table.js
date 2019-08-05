exports.up = function (connection) {
  console.log('creating articles table...');
  return connection.schema.createTable('articles', (articlesTable) => {
    articlesTable.integer('article_id').primary();
    articlesTable.string('title');
    articlesTable.string('body');
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.string('topic').references('topics.slug');
    articlesTable.string('author').references('users.username');
    articlesTable.timestamps('created_at');
  })
};

exports.down = function (connection) {
  console.log('removing articles table...');
  return connection.schema.dropTable('articles');
};