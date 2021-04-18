const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b96xw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());


const port = process.env.PORT || 5054;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("locksmithUser").collection("services");
  const reviewCollection = client.db("locksmithUser").collection("reviews");
  console.log("Database connected successfully");

  // inserting service to database
  app.post('/addService', (req, res) => {
    const service = req.body;
    serviceCollection.insertOne(service)
    .then(result => {
      res.send(result.insertedCount > 0)
    });
  })

  // inserting review to database
  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    reviewCollection.insertOne(newReview)
    .then(result => {
      res.send(result.insertedCount > 0)
    });
  })

  // getting services from database
  app.get('/services', (req, res) => {
    serviceCollection.find({})
    .toArray((err, docs) => {
      res.send(docs);
    })
  });

  // getting reviews from database
  app.get('/reviews', (req, res) => {
    reviewCollection.find({email: req.query.email})
    .toArray((err, docs) => {
      console.log("reviews", docs);
      res.send(docs);
    })
  });

  // find a single service via ObjectId
  app.get('/service/:id', (req, res) => {
    serviceCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, docs) => {
      res.send(docs);
    })
  });

  // delete a service from database
  app.delete('/deleteService/:id', (req, res) => {
    serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    });
  });

  // delete a review from database
  app.delete('/deleteReview/:id', (req, res) => {
    reviewCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    });
  });

});


app.get('/', (req, res) => {
  res.send('Hello Rahat!');
})

app.listen(port);