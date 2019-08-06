const {
  expect
} = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('if passed empty array, return a new empty array', () => {
    expect(formatDates([])).to.not.equal([]);
  });
  it('passed a array with one object, convert its timestamp into a javascript date object, leaving everything else untouched', () => {
    let input = [{
      created_at: 1511354163389,
    }];
    let actual = formatDates(input);
    let expected = [{
      created_at: new Date(1511354163389)
    }];
    expect(actual).to.eql(expected);
  });
  it('passed a array with multiple objects, convert all timestamps into a javascript date object, leaving everything else untouched', () => {
    let input = [{
      created_at: 1511354163389,
    }, {
      created_at: 1448282163389,
    }];
    let actual = formatDates(input);
    let expected = [{
      created_at: new Date(1511354163389)
    }, {
      created_at: new Date(1448282163389)
    }];
    expect(actual).to.eql(expected);
  });
  it("do not mutate the input data", () => {
    let input = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }];
    formatDates(input);
    expect(input).to.eql([{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }]);
  });
  it('passed a array with multiple objects, check all other values untouched ', () => {
    let input = [{
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: 1289996514171,
      },
      {
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: 1163852514171,
      }
    ];
    let actual = formatDates(input);
    let expected = [{
        title: 'Eight pug gifs that remind me of mitch',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'some gifs',
        created_at: new Date(1289996514171)
      },
      {
        title: 'Student SUES Mitch!',
        topic: 'mitch',
        author: 'rogersop',
        body: 'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
        created_at: new Date(1163852514171)
      }
    ];
    expect(actual).to.eql(expected);
  });
})


describe('makeRefObj', () => {
  it('takes a empty array, returns a empty object', () => {
    let input = [];
    let actual = makeRefObj(input);
    let expected = {};
    expect(actual).to.eql(expected);
  });
  it('if passed one article object in array, turns into object lookup with title to key value integer', () => {
    let input = [{
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }];
    let actual = makeRefObj(input);
    let expected = {
      'Living in the shadow of a great man': 1
    }
    expect(actual).to.eql(expected);
  });
  it('if passed multiple article objects in array, turn into object lookup with all title to key value integers', () => {
    let input = [{
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }, {
      article_id: 2,
      title: 'Eight pug gifs that remind me of mitch',
      topic: 'mitch',
      author: 'icellusedkars',
      body: 'some gifs',
      created_at: 1289996514171,
    }];
    let actual = makeRefObj(input);
    let expected = {
      'Living in the shadow of a great man': 1,
      'Eight pug gifs that remind me of mitch': 2
    }
    expect(actual).to.eql(expected);
  });
  it("do not mutate the input data", () => {
    let input = [{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }];
    makeRefObj(input);
    expect(input).to.eql([{
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: 1542284514171,
      votes: 100,
    }]);
  });
});




describe('formatComments', () => {
  it('if passed empty array, return empty array', () => {
    expect(formatComments([])).to.eql([]);
  });
  it('passes a single comment object in array, retitles created_by property to author', () => {
    let commentInput = [{
      created_by: 'icellusedkars'
    }]
    expect(formatComments(commentInput, {})[0].author).to.eql('icellusedkars')
  });
  xit('passes a single comment object in array, retitles belongs_to property to article_id', () => {
    let commentInput = [{
      belongs_to: 'Living in the shadow of a great man'
    }]
    let test = formatComments(commentInput, {})
    expect(test[0].belongs_to).to.have.keys("article_id")
  });
  //how to text this one^^^

  it('passes a single comment object in array, belongs to is changed to article_id and is set equal to value in the refObject passed', () => {
    let commentInput = [{
      belongs_to: 'Living in the shadow of a great man'
    }];
    let articleRef = {
      'Living in the shadow of a great man': 1
    }
    expect(formatComments(commentInput, articleRef)[0].article_id).to.eql(1);
  });
  it('passes a single comment object in array, created at timestamp value converted into a javascript date object', () => {
    let commentInput = [{
      created_at: 1385210163389
    }];
    expect(formatComments(commentInput, {})[0].created_at).to.eql(new Date(1385210163389));
  });
  it('does not mutate original input', () => {
    let input = [{
      comment_id: 1,
      body: 'I hate streaming noses',
      created_by: 'icellusedkars',
      votes: 0,
      created_at: 1385210163389,
    }];
    formatComments(input, {})
    expect(input).to.eql([{
      comment_id: 1,
      body: 'I hate streaming noses',
      created_by: 'icellusedkars',
      votes: 0,
      created_at: 1385210163389,
    }])
  });
  it('passed one comment object in array, has every property needed', () => {
    let input = [{
      comment_id: 1,
      body: ' I carry a log — yes. Is it funny to you? It is not to me.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'icellusedkars',
      votes: -100,
      created_at: 1416746163389,
    }];
    let refObject = {
      'Living in the shadow of a great man': 1
    }
    expect(formatComments(input, refObject)[0]).to.have.keys('comment_id', 'author', 'article_id', 'votes', 'created_at', 'body');
  });
  it('passed multiple objects, updates to each objects keys', () => {
    let input = [{
        comment_id: 3,
        body: 'This is a bad article name',
        belongs_to: 'UNCOVERED: catspiracy to bring down democracy',
        created_by: 'butter_bridge',
        votes: 1,
        created_at: 1038314163389,
      },
      {
        comment_id: 4,
        body: 'The owls are not what they seem.',
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'icellusedkars',
        votes: 20,
        created_at: 1006778163389,
      }
    ];
    let articleRef = {
      'UNCOVERED: catspiracy to bring down democracy': 1,
      "They're not exactly dogs, are they?": 2
    }
    expect(formatComments(input, articleRef)).to.eql([{
        comment_id: 3,
        body: 'This is a bad article name',
        article_id: 1,
        author: 'butter_bridge',
        votes: 1,
        created_at: new Date(1038314163389)
      },
      {
        comment_id: 4,
        body: 'The owls are not what they seem.',
        article_id: 2,
        author: 'icellusedkars',
        votes: 20,
        created_at: new Date(1006778163389)
      }
    ]);
  });
});



// topics: [{
//   description: 'The man, the Mitch, the legend',
//   slug: 'mitch',
// }]


// users: [{
//   username: 'butter_bridge',
//   name: 'jonny',
//   avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
// }]


// articles: [{
//   title: 'Living in the shadow of a great man',
//   topic: 'mitch',
//   author: 'butter_bridge',
//   body: 'I find this existence challenging',
//   created_at: 1542284514171,
//   votes: 100,
// }]

//NEEDS 
//A ARTICLE ID INTEGER, 
//topic references topics.slug, 
//author references users.username




// comments: [{
//   body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
//   belongs_to: "They're not exactly dogs, are they?",
//   created_by: 'butter_bridge',
//   votes: 16,
//   created_at: 1511354163389,
// }]

//NEEDS 
//A comment ID INTEGER, 
//topic references topics.slug, 
//author references users.username
//article_id references articles.article_id