const express = require('express');
require('dotenv').config();
const { connect } = require('./MongoUtil');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const app = express();

app.use(express.json);
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

async function main() {

    const db = await connect(MONGO_URI, DB_NAME);

    app.post('/add', async function(req,res){
        let result = await db.collection('').insertOne({
            
        })
    })



}

app.listen(3000, function() {
    console.log('server started!!!')
})