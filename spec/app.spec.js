process.env.NODE_ENV = 'test';

const chai = require("chai");
const chaiSorted = require("chai-sorted");
const {
  expect
} = chai;
chai.use(chaiSorted);

const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");

describe('app', () => {
  after(() => connection.destroy());
  describe('/api', () => {
    describe('/topics', () => {
      it('GET / returns status 200 & returns array of all topic objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({
            body
          }) => {
            //console.log(body, "<-- body")
            expect(body).to.be.an('object')
            expect(body.topics).to.be.an('array')
            expect(body.topics[0]).to.have.keys('slug', 'description')
          })
      });
    });
    describe('/users', () => {
      it('GET / returns status 200 & returns array containing specific user object', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then(({
            body
          }) => {
            //console.log(body.user, '<-- body')
            expect(body).to.be.an('object')
            expect(body.user).to.be.an('array')
            expect(body.user[0]).to.have.keys('username', 'avatar_url', 'name')
            expect(body.user[0]).to.eql({
              username: 'butter_bridge',
              avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
              name: 'jonny'
            })
          })
      });
    });
    describe('/articles', () => {
      it('GET / returns status 200 & returns array containing specific article object with all the correct keys and a comment count of all the comments left by this id', () => {
        return request(app)
          .get('/api/articles/2')
          .expect(200)
          .then(({
            body
          }) => {
            console.log(body)
            expect(body).to.be.an('object')
            expect(body.article).to.be.an('array')
            expect(body.article[0]).to.have.keys('article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count')

          })
      });
    });
  });
});