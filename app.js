// jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
// const ejs = require('ejs');
const port = 3000;
const items = [];

mongoose.connect('mongodb://localhost:27017/todolistDB');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));

app.get('/', (req, res) => {
  const today = new Date();
  var options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  let date = today.toLocaleDateString('en-US', options);

  res.render('list', {
    newItems: items,
    date: date
  });
});

app.post('/', (req, res) => {
  const newPost = req.body.newListItem;
  console.log(newPost);
  items.push(newPost);
  res.redirect('/');
});


app.listen(port, () => console.log(`Server has started on port ${port}.`));