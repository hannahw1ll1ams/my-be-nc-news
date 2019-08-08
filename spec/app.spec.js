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
            //should no longer be a array if just one object body.user should be a object with the keys username, url etc
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
              created_at: "2018-11-15T12:21:54.171Z",
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
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 50
            })
          })
      });
      it('PATCH / return status 400 and message of bad request if no update on request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('PATCH / return status 400 and message of bad request if wrong type of data provided in request', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({
            inc_votes: "cat"
          })
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('PATCH / return status 201 and and returns updated votes key on article object when given multiple pieces of information on request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({
            inc_votes: 85,
            name: 'Mitch'
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
              created_at: "2018-11-15T12:21:54.171Z",
              votes: 185
            })
          })
      });
      it('POST / returns status 201 and new comment added to article', () => {
        return request(app)
          .post('/api/articles/5/comments')
          .send({
            username: 'butter_bridge',
            body: 'It is what it is...'
          })
          .expect(201)
          .then(({
            body
          }) => {
            console.log(body)
            expect(body.comment[0]).to.have.keys("comment_id", "author", "article_id", "votes", "created_at", "body")
            expect(body.comment[0].comment_id).to.eql(19)
            expect(body.comment[0].author).to.eql("butter_bridge")
            expect(body.comment[0].article_id).to.eql(5)
            expect(body.comment[0].votes).to.eql(0)
            expect(body.comment[0].body).to.eql("It is what it is...")
          })
      });
      it('POST / return status 404 Page Not Found for not existing article id', () => {
        return request(app)
          .post('/api/articles/100/comments')
          .send({
            username: 'butter_bridge',
            body: 'It is what it is...'
          })
          .expect(404)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql("Page Not Found")
          })
      });
      it('POST / return status 404 Page Not Found for valid article_id but wrong path typed', () => {
        return request(app)
          .post('/api/articles/1/comme')
          .send({
            username: 'butter_bridge',
            body: 'It is what it is...'
          })
          .expect(404)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql("Page Not Found")
          })
      });
      it('POST / return status 400 Bad Request for missed required body field', () => {
        return request(app)
          .post('/api/articles/5/comments')
          .send({
            username: 'butter_bridge'
          })
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('POST / return status 400 Bad Request for missed required username field', () => {
        return request(app)
          .post('/api/articles/5/comments')
          .send({
            body: 'It is what it is'
          })
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('POST / return status 400 Bad Request for schema violations', () => {
        return request(app)
          .post('/api/articles/5/comments')
          .send({
            username: 'butter_bridge',
            body: 2349328948
          })
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('POST / return status 400 Bad Request for wrong keys inputted', () => {
        return request(app)
          .post('/api/articles/5/comments')
          .send({
            writer: 'butter_bridge',
            votes: 56
          })
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('GET / responds with status 200 and an array of comments for the given `article_id` of which each comment should have the correct properties', () => {
        return request(app)
          .get('/api/articles/5/comments')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.comments[0]).to.have.keys('comment_id', 'author', 'votes', 'created_at', 'body')
            expect(body.comments[0].comment_id).to.eql(14)
            expect(body.comments[0].author).to.eql('icellusedkars')
            expect(body.comments[0].votes).to.eql(16)
            expect(body.comments[0].body).to.eql('What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.')
          })
      })
      it('GET/ ', () => {

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