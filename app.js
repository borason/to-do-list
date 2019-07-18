// jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// const ejs = require('ejs');
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  const item = 'New List Item';
  res.render('list', {
    listItem: item
  });
});

app.post('/', (req, res) => console.log(req.body.newListItem));


app.listen(port, () => console.log(`Server has started on port ${port}.`));