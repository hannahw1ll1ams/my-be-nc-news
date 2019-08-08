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
      it('GET/:article_id/comments default returns the comments sorted by created_by time and descending in order from new to old', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.comments).to.be.sortedBy('created_at', {
              descending: true
            })
          })
      });
      it('GET/:article_id/comments returns the comments sorted by any specified collum default descending', () => {
        return request(app)
          .get('/api/articles/5/comments?sort_by=author')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.comments).to.be.sortedBy('author', {
              descending: true
            })
          })
      });
      it('GET/:article_id/comments returns the comments sorted by default created at and ordered by what specified in query', () => {
        return request(app)
          .get('/api/articles/5/comments?sort_by=author&order=asc')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.comments).to.be.sortedBy('created_at', {
              ascending: true
            })
          })
      });
      it('GET/:article_id/comments returns the comments sorted by and ordered by what is specified in query', () => {
        return request(app)
          .get('/api/articles/5/comments?sort_by=author&order=asc')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.comments).to.be.sortedBy('author', {
              ascending: true
            })
          })
      });
      it('GET/:article_id/comments returns status 400 Bad request for a invalid id', () => {
        return request(app)
          .get('/api/articles/bananas/comments?sort_by=author&order=asc')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql("Bad Request")
          })
      });
      it('GET /returns status 404 Page Not Found for a not found article_id', () => {
        return request(app)
          .get('/api/articles/1909248/comments?sort_by=author')
          .expect(404)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql("Page Not Found")
          })
      });
      it('GET / returns status 400 Bad Request for a query request to be sorted by a column that does not exist', () => {
        return request(app)
          .get('/api/articles/5/comments?sort_by=fruit')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('GET / returns status 400 Bad Request for a query request to be ordered by a invalid order', () => {
        return request(app)
          .get('/api/articles/5/comments?order=pies')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('GET / returns status 400 Bad Request for a bad query request', () => {
        return request(app)
          .get('/api/articles/5/comments?order=pies&sort_by=pigeons')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });

      it('GET / returns status 200 and returns array of article objects', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body
          }) => {
            console.log(body.articles[3])
            expect(body).to.be.an('object')
            expect(body.articles).to.be.an('array')
            expect(body.articles[3]).to.have.keys('author', 'body', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count')
            expect(body.articles[3].author).to.eql('rogersop')
            expect(body.articles[3].body).to.eql('We all love Mitch and his wonderful, unique typing style. ' +
              'However, the volume of his typing has ALLEGEDLY burst ' +
              'another students eardrums, and they are now suing for ' +
              'damages')
            expect(body.articles[3].title).to.eql('Student SUES Mitch!')
            expect(body.articles[3].article_id).to.eql(4)
            expect(body.articles[3].topic).to.eql('mitch')
            expect(body.articles[3].votes).to.eql(0)
            expect(body.articles[3].comment_count).to.eql('0')
          })
      });
      it('GET / returns status 200 and sorts articles by default-date  when not specified', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({
            body
          }) => {
            //console.log(body.articles)
            expect(body.articles).to.be.sortedBy('created_at', {
              descending: true
            })
          })
      });
      it('GET / returns status 200 and sorts articles by whatever column is specified in query', () => {
        return request(app)
          .get('/api/articles?sort_by=topic')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles).to.be.sortedBy('topic', {
              descending: true
            })
          })
      });
      it('GET / returns status 200 and sorts a column depending if passed', () => {
        return request(app)
          .get('/api/articles?order=asc')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles).to.be.sortedBy('created_at', {
              ascending: true
            })
          })
      });
      it('GET / returns status 200 and query of author which will filter down the articles by the username specified in query', () => {
        return request(app)
          .get('/api/articles?author=icellusedkars')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles[0].author).to.eql('icellusedkars')
            expect(body.articles.length).to.eql(6)
            expect(body.articles.every(article => article.author === 'icellusedkars')).to.be.true;
          })
      });
      it('GET / returns status 200 and query of topic which filters the articles by the topic value specified in the query', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles[0].topic).to.eql('cats')
          })
      });
      it('GET/ status 400 Bad Request when passed a sortby query by invalid column', () => {
        return request(app)
          .get('/api/articles?sort_by=donkey')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('GET/ status 400 Bad Request when passed a author query which does not exist', () => {
        return request(app)
          .get('/api/articles?author=chorizocroquettes')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('GET/ status 400 Bad Request when passed a topic query which does not exist', () => {
        return request(app)
          .get('/api/articles?topic=2345')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('GET / status 400 Bad Request when passed a invalid order query', () => {
        return request(app)
          .get('/api/articles?order=loopdeloop')
          .expect(400)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Bad Request')
          })
      });
      it('GET / status 200 success when passed a query that is not defined returns all of articles', () => {
        return request(app)
          .get('/api/articles?colour=neonyellow')
          .expect(200)
          .then(({
            body
          }) => {
            expect(body.articles.length).to.eql(12)
          })
      });
      // it.only('GET / status 400 Bad Request when passed a query that is not defined', () => {
      //   return request(app)
      //     .get('/api/articles?colour=neonyellow')
      //     .expect(400)
      //     .then(({
      //       body
      //     }) => {
      //       expect(body.msg).to.eql('Bad Request')
      //     })
      // }); // how would i do this test?
      it('GET / status 405 Method Not Allowed when passed a method that cannot be implemented on articles path', () => {
        return request(app)
          .delete('/api/articles')
          .expect(405)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Method Not Allowed')
          })
      });
      it('GET / status 405 Method Not Allowed when passed a method that cannot be implemented on articles path', () => {
        return request(app)
          .post('/api/articles/1')
          .expect(405)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Method Not Allowed')
          })
      });
      it('GET / status 405 Method Not Allowed when passed a method that cannot be implemented on users path', () => {
        return request(app)
          .delete('/api/users')
          .expect(405)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Method Not Allowed')
          })
      });
      it('GET / status 405 Method Not Allowed when passed a method that cannot be implemented on users path', () => {
        return request(app)
          .post('/api/users/butter_bridge')
          .expect(405)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Method Not Allowed')
          })
      });
      it.only('GET / status 405 Method Not Allowed when passed a method that cannot be implemented on topics path', () => {
        return request(app)
          .delete('/api/topics')
          .expect(405)
          .then(({
            body
          }) => {
            expect(body.msg).to.eql('Method Not Allowed')
          })
      });
    });
  });
});