// jshint esversion: 6
// connection variables
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
// const ejs = require('ejs');
const port = 3000;

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true
});

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
  name: "Click on the garbage can to delete a task"
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, (req, res) => {
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
  // const today = new Date();
  // var options = {
  //   weekday: "long",
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric"
  // };
  // let date = today.toLocaleDateString("en-US", options);

  Item.find(function (err, foundItems) {
    if (foundItems === 0) {
      Item.insertMany(defaultItems, (req, res) => {
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
  const newItem = req.body.newListItem;
  const listName = req.body.list;
  let capitalizedNewItem = newItem.charAt(0).toUpperCase() + newItem.slice(1);
  const item = new Item({
    name: capitalizedNewItem
  });
  if (listName === 'Today') {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, (err, foundList) => {
      console.log(foundList);
      foundList.items.push(item);
      foundList.save();
      res.redirect('/' + listName);
    });


  }

});

app.post("/delete", (req, res) => {
  const deletedItem = req.body.checkbox;
  Item.findByIdAndRemove(deletedItem, err => {
    if (err) {
      console.log(err);
    } else {
      console.log("Item deleted from DB");
    }
  });
  res.redirect("/");
});

app.get("/:listName", (req, res) => {
  const listName = req.params.listName;

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
        console.log(listName);
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