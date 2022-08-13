const express = require('express');
require('dotenv').config();
const { connect } = require('./MongoUtil');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const app = express();

app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

async function main() {

    const db = await connect(MONGO_URI, DB_NAME);

    app.post('/add', async function (req, res) {
        let result = await db.collection('earphone').insertOne({
            'brand': req.body.brand,
            'type': req.body.type,
            'bluetooth': req.body.bluetooth,
            'price': req.body.price,
            'color': req.body.color,
            'time': req.body.time,
            'dustproof-and-waterproof': req.body.proof,
            'connectors': req.body.connectors
        })
    })
    
    app.get('/earphone',async function(req,res){
        let criteria = {};
        if(req.query.type) {
            criteria.type = {
                '$regex': req.query.type, '$options': 'i'
            }
        }

        if(req.query.connectors) {
            criteria.connectors = {
                '$regex': req.query.connectors, '$options': 'i'
            }
        }

        if(req.query.min_price) {
            criteria.price = {
                '$gte': parseInt(req.query.min_price)
            }
        }

        if(req.query.max_price) {
            criteria.price = {
                '$lte': parseInt(req.query.max_price)
            }
        }

        let result = await db.collection('earphone').find(criteria, {
            'projection': {
                'brand': 1,
                'color': 1
            }
        }).toArray();
        res.status(200);
        res.send(result);
    })

    app.put('/earphone/:id',async function(req,res){
        let earphone = await db.collection('earphone').findOne({
            '_id': ObjectId(req.params.id)
        })

        let result = await db.collection('earphone').updateOne({
            '_id': ObjectId(req.params.id)
        },{
            '$set': {
                'brand': req.body.brand ? req.body.brand : earphone.brand,
                'type': req.body.type ? req.body.type : earphone.description,
                'price': req.body.price ? req.body.price : earphone.price
            }
        })
        res.status(200);
        res.send(result);
    })

    app.delete('/earphone/:id',async function(req,res){
        await db.collection('earphone').deleteOne({
            '_id': ObjectId(req.params.id)
        })
        res.status(200);
        res.send(result);
    })

    app.post('/earphone/:id/reviews',async function(req,res){
        let result = await db.collection('earphone').updateOne({
            '_id': ObjectId(req.params.id)
        },{
            '$push': {
                'reviews': {
                    '_id': ObjectId(),
                    'email': req.body.email,
                    'content': req.body.content,
                    'rating': req.body.rating
                }
            }
        })
        res.status(200);
        res.send(result);
    })

    app.get('/earphone/:id/reviews',async function(req,res){
        let result = await db.collection('earphone').findOne({
            '_id': ObjectId(req.params.id)
        },{
            'projection': {
                '_id': 1,
                'brand': 1,
                'type': 1,
                'reviews': 1
            }
        })
        res.status(200);
        res.send(result);
    })

}

app.listen(3000, function () {
    console.log('server started!!!')
})