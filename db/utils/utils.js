exports.formatDates = list => {
  if (list.length === 0) return [];
  let newDates = list.map(comment => {
    let currentTime = comment.created_at;
    let newDate = new Date(currentTime);
    let {
      created_at,
      ...restofComment
    } = comment;
    return {
      ...restofComment,
      created_at: newDate
    };
  })
  return newDates;
};


exports.makeRefObj = list => {
  if (list.length === 0) return {};
  const articleRefLookup = {};
  list.forEach(article => {
    articleRefLookup[article.title] = article.article_id;
    return articleRefLookup;
  })
  return articleRefLookup;
};


exports.formatComments = (comments, articleRef) => {
  if (comments.length === 0) return [];
  let formattedComments = comments.map(comment => {
    let {
      created_by,
      belongs_to,
      created_at,
      ...restOfComment
    } = comment;
    let currentTime = comment.created_at;
    return {
      ...restOfComment,
      author: comment.created_by,
      article_id: articleRef[comment.belongs_to],
      created_at: new Date(currentTime)
    }
  })
  return formattedComments;
};