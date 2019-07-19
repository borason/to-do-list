// jshint esversion: 6
// connection variables
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');
const app = express();
// const ejs = require('ejs');
const port = 3000;

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true
});

mongoose.set('useFindAndModify', false);

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("item", itemSchema);
const item1 = new Item({
  name: "Welcome to your to do list."
});
const item2 = new Item({
  name: "Enter a task and hit the send button."
});
const item3 = new Item({
  name: "Click on the checkbox can to delete a task"
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, (req, res, err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Sucessfully added default items to DB");
//   }
// });

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(express.static("public"));

app.get("/", (req, res) => {

  // checks to see if there any items saved inside the database
  Item.find(function (err, foundItems) {
    if (foundItems === 0) {
      // if not loads the default items for the list
      Item.insertMany(defaultItems, (req, res, err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Sucessfully added default items to DB");
        }
      });
    }
    res.render("list", {
      newItems: foundItems,
      listTitle: 'Today'
    });
  });
});

app.post("/", (req, res) => {
  // gets the value of text posted from 'add new task' text filt
  const newItem = req.body.newListItem;
  const listName = req.body.list;
  let capitalizedNewItem = newItem.charAt(0).toUpperCase() + newItem.slice(1);
  // creates the new item
  const item = new Item({
    name: capitalizedNewItem
  });
  // if the list name is equal to today it adds the new task to database and refreshes the page
  if (listName === 'Today') {
    item.save();
    res.redirect("/");
  } else {
    // if not checks the list DB to see if the list exists
    List.findOne({
      name: listName
    }, (err, foundList) => {
      // saves the item to the list found in the DB
      foundList.items.push(item);
      foundList.save();
      res.redirect('/' + listName);
    });
  }
});

app.post("/delete", (req, res) => {
  // Gets id # and list title from deleted item
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  //
  // If deleted from home page, then delete from itemDB
  if (listName === 'Today') {
    Item.findByIdAndRemove(checkedItemId, err => {
      if (!err) {
        console.log('Successfully deleted item from DB');
        res.redirect("/");
      }
    });
  } else {
    // If deleted from different route then searches lists collection to find correct item
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, (err, foundList) => {
      if (!err) {
        res.redirect('/' + listName);
      }
    });
  }

});

app.get("/:listName", (req, res) => {
  const listName = _.capitalize(req.params.listName);

  List.findOne({
    name: listName
  }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        //create new list
        const list = new List({
          name: listName,
          items: defaultItems
        });
        list.save();
        res.redirect('/' + listName);
      } else {
        //show existing list
        res.render('list', {
          listTitle: foundList.name,
          newItems: foundList.items
        });
      }
    }
  });
});

app.listen(port, () => console.log(`Server has started on port ${port}.`));