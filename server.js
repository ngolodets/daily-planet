const express = require('express');
const layouts = require('express-ejs-layouts');
const fs = require('fs');
const methodOverride = require('method-override');

const PORT = 3000;

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(layouts);
app.use(express.static(__dirname + '/static'));   //or express.static('static')
app.use(methodOverride('_method'));

app.get('/', function(req, res) {
  //res.send("We should add some nice landing page stuff here!!!");
  res.render('index');
});

// GET /articles - gets all articles
app.get('/articles', function(req, res) {
  var articles = fs.readFileSync("./articles.json");
  var articleData = JSON.parse(articles);
  res.render('articles/index', {articleData});
});

// GET /articles/new - NEW article form
app.get('/articles/new', function(req, res) {  
  res.render('articles/new'); 
});

// GET /articles/:id/edit - updates the article
app.get('/articles/:id/edit', function(req, res) {
  let articles = fs.readFileSync('./articles.json');
  let articleData = JSON.parse(articles);
  let id = parseInt(req.params.id);
  res.render('articles/edit', {article: articleData[id], id});
});

// GET /articles/:id - gets one article
app.get('/articles/:id', function(req, res) {
  var articles = fs.readFileSync("./articles.json");
  var articleData = JSON.parse(articles);
  var id = parseInt(req.params.id);
  res.render('articles/show', {article: articleData[id], id});
});

// POST /articles - add NEW article info from the form
app.post('/articles', function(req, res) {
  let articles = fs.readFileSync('./articles.json');
  var articleData = JSON.parse(articles);
  var newArticle = {
    title: req.body.articleTitle,
    body: req.body.articleBody
  }
  articleData.push(newArticle);
  fs.writeFileSync('./articles.json', JSON.stringify(articleData));
  res.redirect('/articles');
});

// DELETE /articles/:id - deletes one article
app.delete('/articles/:id', function(req, res) {
  var articles = fs.readFileSync("./articles.json");
  var articleData = JSON.parse(articles);
  var id = parseInt(req.params.id);
  articleData[id].title = req.body.articleTitle;
  articleData[id].body = req.body.articleBody;
  fs.writeFileSync('./articles.json', JSON.stringify(articleData));
  res.redirect('/articles/' + id);
});

// PUT /articles/:id
app.put('/articles/:id', function(req, res) {
  var articles = fs.readFileSync("./articles.json");
  var articleData = JSON.parse(articles);
  var id = parseInt(req.params.id);
  articleData[id].title = req.body.articleTitle;
  articleData[id].body = req.body.articleBody;
  fs.writeFileSync('./articles.json', JSON.stringify(articleData));
  res.redirect('/articles/' + id);
});

app.listen( PORT || 3000, function(req, res) {
  console.log("I am listening 🥺 on port " + PORT);
});
