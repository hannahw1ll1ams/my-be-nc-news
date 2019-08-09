process.env.NODE_ENV = "test";

const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');

const {
  formatDates,
  formatComments,
  makeRefObj
} = require('../utils/utils');

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex('topics').insert(topicData);
      const usersInsertions = knex('users').insert(userData);
      return Promise.all([topicsInsertions, usersInsertions])
        .then(() => {
          const reformattedList = formatDates(articleData);
          //console.log(reformattedList, '<-- reformatted list');
          return knex.insert(reformattedList).into('articles').returning("*")
        })
        .then(articleRows => {
          //console.log(articleRows, "<--- article rows")
          const articleRef = makeRefObj(articleRows);
          const formattedComments = formatComments(commentData, articleRef);
          return knex('comments').insert(formattedComments);
        });
    })
}