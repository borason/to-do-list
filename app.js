// jshint esversion: 6
// connection variables
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
// const ejs = require('ejs');
const port = 3000;

mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true
});

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model('item', itemSchema);
const item1 = new Item({
  name: 'Welcome to your to do list.'
});
const item2 = new Item({
  name: 'Enter a task and hit the send button.'
});
const item3 = new Item({
  name: 'Click on the garbage can to delete a task 👉'
});

const defaultItems = [item1, item2, item3];
// Item.insertMany(defaultItems, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log('Sucessfully added default items to DB');
//   }
// });

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

  Item.find(function (err, foundItems) {
    if (foundItems === 0) {
      Item.insertMany(defaultItems, (req, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Sucessfully added default items to DB');
        }
      });
    }
    res.render('list', {
      newItems: foundItems,
      date: date
    });
  });



});

app.post('/', (req, res) => {
  const newPost = req.body.newListItem;
  let capitalizedPost = newPost.charAt(0).toUpperCase() + newPost.slice(1);
  console.log(capitalizedPost);
  Item.create({
    name: capitalizedPost
  }, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('post successfully added to DB');
    }
  });
  res.redirect('/');
});


app.listen(port, () => console.log(`Server has started on port ${port}.`));