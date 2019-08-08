\c nc_news_test
-- SELECT * FROM comments;

SELECT article_id, title, author FROM articles;

SELECT comment_id, article_id, author FROM comments;

SELECT articles.article_id, articles.title, COUNT(comments.comment_id) AS comment_count FROM articles
LEFT JOIN comments ON articles.article_id = comments.article_id
GROUP BY articles.article_id;




-- LEFT JOIN means in venn diagramm of articles and comments, articles is on left and all articles will be shown regardless in they have no comments, will come up with 0. If was right join which is on comments, articles without comments wouldn't be shown.


-- SELECT houses.house_id, house_name, COUNT(wizards.wizards_id) AS student_count FROM HOUSES
-- LEFT JOIN wizards ON houses.house_id = wizards.house_id
-- GROUP BY houses.house_id;

-- psql -f db/queries.sql > output.txt



-- now in articles model
-- return connection.select('houses.*').from('houses').count('wizards.wizard_id as student_count').leftJoin('wizards', 'houses.house_id', '=', 'wizards.house_id').groupBy('houses.house_id').orderBy()