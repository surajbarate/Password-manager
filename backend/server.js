const express = require('express');
const app = express();
const bodyparsor = require('body-parser')
const cors = require('cors')

const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'passwordMG';
require('dotenv').config()
const port = 3000;
app.use(bodyparsor.json())
app.use(cors())

 client.connect();

 //get passwords
app.get('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.find({}).toArray();
  res.json(findResult)
});

//save the passwords
app.post('/', async (req, res) => {
  const password = req.body 
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.insertOne(password);
  res.send({success:true, result:findResult})
});

//for delete
app.delete('/', async (req, res) => {
  const password = req.body 
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const findResult = await collection.deleteOne(password);
  res.send({success:true, result:findResult})
});

// Update password
app.put('/', async (req, res) => {
  const password = req.body;
  const db = client.db(dbName);
  const collection = db.collection('passwords');
  const result = await collection.updateOne({ _id: new MongoClient.ObjectId(password.id) }, { $set: password });
  res.send({ success: true, result });
});


app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});
