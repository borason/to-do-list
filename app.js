// jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// const ejs = require('ejs');
const port = 3000;
const items = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.render('list', {
    items: items
  });
});

app.post('/', (req, res) => {
  const newPost = req.body.newListItem;
  items.push(newPost);
  res.redirect('/');
});


app.listen(port, () => console.log(`Server has started on port ${port}.`));