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
  beforeEach(() => connection.seed.run());
  describe('/api', () => {
    describe('/topics', () => {
      it('GET / returns status 200 & returns array of all topic objects with correct keys', () => {
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
      it('GET / returns status 404 responds an error message > Page Not Found', () => {
        return request(app)
          .get('/api/topi')
          .expect(404)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Page Not Found')
          })
      });
      it('GET / returns status 404 responds an error message > Page Not Found', () => {
        return request(app)
          .get('/ap')
          .expect(404)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Page Not Found')
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
      it('GET / returns status 404 responds an error message > Page Not Found for a username that does not exist', () => {
        return request(app)
          .get('/api/users/hannah')
          .expect(404)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Page Not Found')
          })
      });
    });


    describe.only('/articles', () => {
      it('GET / returns status 200 & returns array containing specific article object with all the correct keys and a comment count of all the comments left by this id', () => {
        return request(app)
          .get('/api/articles/2')
          .expect(200)
          .then(({
            body
          }) => {
            // console.log(body)
            expect(body).to.be.an('object')
            expect(body.article).to.be.an('array')
            expect(body.article[0]).to.have.keys('article_id', 'title', 'body', 'votes', 'topic', 'author', 'created_at', 'comment_count')
          })
      });
      it('GET / returns status 404 responds an error message > Page Not Found for a article_id that does not exist', () => {
        return request(app)
          .get('/api/articles/9999999')
          .expect(404)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Page Not Found')
          })
      });
      it('GET / returns status 400 for invalid article_id, returns message of Bad Request', () => {
        return request(app)
          .get('/api/articles/dog')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('PATCH / returns status 201 and returns updated article object when passed positive number', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({
            inc_votes: 1
          })
          .expect(201)
          .then(({
            body
          }) => {
            //console.log(body, "<--- body")
            expect(body.article[0]).to.eql({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: new Date(1542284514171),
              votes: 101
            })
          })
      });
      it('PATCH / return status 201 and returns updated article object when passed negative number', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({
            inc_votes: -50
          })
          .expect(201)
          .then(({
            body
          }) => {
            //console.log(body, "<--- body")
            expect(body.article[0]).to.eql({
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: new Date(1542284514171),
              votes: 50
            })
          })
      });
      it.only('PATCH / return status 400 and message of bad request if no update on request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .expect(400)
      });
    });

  });


});





// it('GET / will order houses by default to number of students descending', () => {
//   return request(app)
//     .get('/api/houses')
//     .expect(200)
//     .then(({
//       body
//     }) => {
//       // console.log(body)
//       expect(body).to.be.an('object')
//       expect(body.houses).to.be.sortedBy('student_count', {descending :true})
// });