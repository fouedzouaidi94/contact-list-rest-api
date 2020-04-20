const express = require("express");
const assert = require("assert");
const { MongoClient, ObjectID } = require("mongodb");
const app = express();
app.use(express.json());

const MongoURI =
  "mongodb+srv://fou:1234@cluster0-f7zmb.mongodb.net/test?retryWrites=true&w=majority";
const dataabse = "Contact-List";
MongoClient.connect(MongoURI, { useUnifiedTopology: true }, (err, client) => {
  assert.equal(err, null, "connection to database failed");
  const db = client.db(dataabse);
  //adding conatct
  app.post("/add_contact", (req, res) => {
    let newContact = req.body;
    db.collection("contacts").insertOne(newContact, (err, data) => {
      err ? console.log("cannot add contact") : res.send(data);
    });
  });
  //getting conatcts
  app.get("/contacts", (req, res) => {
    db.collection("contacts")
      .find()
      .toArray((err, data) => {
        err ? console.log("cannot get contacts") : res.send(data);
      });
  });
  //delete conatct by id
  app.delete("/delete_contact/:id", (req, res) => {
    let contact = req.params.id;
    db.collection("contacts").findOneAndDelete(
      { _id: ObjectID(contact) },
      (err, data) =>
        err ? console.log("cannot delete contact") : res.send("contact deleted")
    );
  });
  //edit contact by id
  app.put("/edit_contact/:id", (req, res) => {
    let contact = req.params.id;
    db.collection("contacts").findOneAndUpdate(
      { _id: ObjectID(contact) },
      { $set: req.body },
      (err, data) => {
        err ? console.log("cannot edit contact") : res.send(data);
      }
    );
  });
});

const port = process.env.PORT || 5000;
app.listen(port, (err) => {
  err
    ? console.log("cannot connect to server")
    : console.log(`server is running on port ${port}...`);
});
