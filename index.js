const express = require('express');
require('dotenv').config();
const { connect } = require('./MongoUtil');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const app = express();
const jwt = require('jsonwebtoken');
const { validateProduct, validateParamsQuery, validateReview, validateSignup, validateLogin, validateUserUpdate, } = require('./validator');
const bcrypt = require('bcryptjs');

app.use(express.json());
app.use(cors());

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

function checkIfAuthenticationJWT(req,res,next) {
    if(req.headers.authorization) {
        const headers = req.headers.authorization;
        const token = headers.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, function(err, tokenData){
            if(err) {
                res.sendStatus(403);
                return;
            }
            req.student = tokenData;
            next();
        })
    } else {
        res.sendStatus(403);
    }
}

function validator(data,req,res) {
    const { error, value } = data(req);
    if(error) return res.status(422).json((error.details).map(e => e.message));
}

async function main() {
    const db = await connect(MONGO_URI, DB_NAME);

    // ADD NEW PRODUCT
    app.post('/add',[checkIfAuthenticationJWT],async function (req,res) {
        // VALIDATE BODY
        if(validator(validateProduct,req.body,res)) return res;

        await db.collection('earphone').insertOne({
            'brandModel': req.body.brandModel,
            'type': req.body.type,
            'earbuds': req.body.earbuds,
            'bluetooth': req.body.bluetooth,
            'price': req.body.price,
            "stock": req.body.stock,
            'color': req.body.color,
            'hours': req.body.hours,
            'dustWaterproof': req.body.dustWaterproof,
            'connectors': req.body.connectors,
        })

        res.status(201).json({
            'message': 'Created successfully'
        });
    })
    
    // SEARCH FOR PRODUCT
    app.get('/earphone',[checkIfAuthenticationJWT],async function(req,res){
        // VALIDATE QUERY
        if(validator(validateParamsQuery,req.query,res)) return res;

        // PAGINATION
        let { page = 1, limit = 2 } = req.query;
        let criteria = {};

        if(req.query.type) {
            criteria.type = {
                '$regex': req.query.type, '$options': 'i'
            }
        }

        if(req.query.otherType) {
            criteria.type = {
                '$ne': req.query.otherType
            }
        }

        if(req.query.otherMusicHours) {
            criteria['hours.music'] = {
                '$not': {
                    '$eq': parseInt(req.query.otherMusicHours)
                }
            }
        }

        if(req.query.store) {
            criteria.stock = {
                '$elemMatch': {
                    'store': req.query.store
                }
            }
        }

        if(req.query.color) {
            criteria.color = {
                '$in': [req.query.color]
            }
        }

        if(req.query.otherColor) {
            criteria.color = {
                '$nin': [req.query.otherColor]
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

        const result = await db.collection('earphone').find(criteria, {
            'projection': {
                '_id': 1,
                'brandModel': 1,
                'type': 1,
                'bluetooth': 1,
                'price': 1,
                'stock': 1,
                'color': 1,
                'hours': 1,
                'dustWaterproof': 1,
                'connectors': 1
            }
        }).limit(limit * 1).skip((page - 1) * limit).toArray();

        res.status(200).json({
            page, limit, result
        });
    })

    //UPDATE DETAILS OF PRODUCT
    app.put('/earphone/:id',[checkIfAuthenticationJWT],async function(req,res){
        try {
            // VALIDATE BODY
            if(validator(validateProduct,req.body,res)) return res;

            const earphone = await db.collection('earphone').findOne({
                '_id': ObjectId(req.params.id)
            })

            // EARPHONE ID NOT FOUND
            if(earphone == null) throw err;

            await db.collection('earphone').updateOne({
                '_id': ObjectId(req.params.id)
            },{
                '$set': {
                    'brandModel': req.body.brandModel ? req.body.brandModel : earphone.brandModel,
                    'type': req.body.type ? req.body.type : earphone.type,
                    'earbuds': req.body.earbuds ? req.body.earbuds : earphone.earbuds,
                    'bluetooth': req.body.bluetooth ? req.body.bluetooth : earphone.bluetooth,
                    'price': req.body.price ? req.body.price : earphone.price,
                    'stock': req.body.stock ? req.body.stock : earphone.stock,
                    'color': req.body.color ? req.body.color : earphone.color,
                    'hours': req.body.hours ? req.body.hours : earphone.hours,
                    'dustWaterproof': req.body.dustWaterproof ? req.body.dustWaterproof : earphone.dustWaterproof,
                    'connectors': req.body.connectors ? req.body.connectors : earphone.connectors
                }
            })

            res.status(200).json({
                'message': 'Updated succesfully'
            });
        } catch(err) {
            res.status(400).end('Any modifications are needed')
        }
    })

    // DELETE PRODUCT
    app.delete('/earphone/:id',[checkIfAuthenticationJWT],async function(req,res){
        // VALIDATE PARAMS
        if(validator(validateParamsQuery,req.params,res)) return res;
       
        try {
            const result = await db.collection('earphone').deleteOne({
                '_id': ObjectId(req.params.id)
            })
            
            // NO EARPHONE ID TO DELETE
            if(result.deletedCount === 0) throw err;

            res.status(200).json({
                'message': 'Deleted successfully'
            });
        } catch(err) {
            res.status(400).end('Any modifications are needed')
        }
    })

    // ADD PRODUCT REVIEW 
    app.post('/earphone/:id/review',[checkIfAuthenticationJWT],async function(req,res){
        // VALIDATE BODY
        if(validator(validateReview,req.body,res)) return res;

        try {
            const result = await db.collection('earphone').updateOne({
                '_id': ObjectId(req.params.id)
            },{
                '$push': {
                    'review': {
                        '_id': ObjectId(),
                        'email': req.body.email,
                        'comments': req.body.comments,
                        'rating': req.body.rating,
                        'date': new Date()
                    }
                }
            })

            // NO REVIEW ID TO DELETE
            if(result.modifiedCount === 0) throw err;
        
            res.status(201).json({
                'message': 'Created successfully'
            })
        } catch(err) {
            res.status(400).end('Any modifications are needed')
        }
    })

    // GET A REVIEW
    app.get('/earphone/:id/review',[checkIfAuthenticationJWT],async function(req,res){
        // VALIDATE PARAMS
        if(validator(validateParamsQuery,req.params,res)) return res;

        try {
            const result = await db.collection('earphone').findOne({
                '_id': ObjectId(req.params.id)
            },{
                'projection': {
                    '_id': 1,
                    'brandModel': 1,
                    'review': 1
                }
            })

            // EARPHONE ID NOT FOUND
            if(result === null) throw err;

            res.status(200).send(result);
        } catch(err) {
            res.status(400).end('Any modifications are needed')
        }
    })

    // GET USER'S REVIEW FROM PRODUCT
    app.get('/user/:id/:email/review',[checkIfAuthenticationJWT],async function(req,res){
        // VALIDATE QUERY
        if(validator(validateParamsQuery,req.query,res)) return res;
        
        // PAGINATION
        let { page = 1, limit = 2 } = req.query;

        try {
            const result = await db.collection('user').aggregate([
                { $match: { _id: ObjectId(req.params.id)} },
                { $lookup: {
                    from: "earphone",
                    localField: "email",
                    foreignField: "review.email",
                    as: "userAllReviews"
                }},
                { $unwind: "$userAllReviews" },
                { $unwind: "$userAllReviews.review" },
                { $match: {'userAllReviews.review.email': req.params.email} },
                { $project: {
                        'userAllReviews.brandModel': 1,
                        'userAllReviews.review': 1
                }},
                { $skip: parseInt(page - 1) * limit },
                { $limit: limit * 1 },
            ]).toArray();
            
            // IF USER ID OR EMAIL OR REVIEW NOT FOUND
            if(!result || result.length === 0) throw err;

            res.status(200).json({
                page, limit, result
            });
        } catch(err) {
            res.status(400).end('Any modifications are needed or no review')
        }
    })

    // EDIT THE REVIEW
    app.put('/earphone/:id/review/:reviewid',[checkIfAuthenticationJWT],async function(req,res){
        // VALIDATE BODY
        if(validator(validateReview,req.body,res)) return res;

        try {
            const review = await db.collection('earphone').findOne({
                '_id': ObjectId(req.params.id),
                'review._id': ObjectId(req.params.reviewid)
            },{
                'projection': {
                    'review.$': 1,
                }
            })

            // NO IDs FOUND
            if(!review) throw err;

            const result = await db.collection('earphone').updateOne({
                '_id': ObjectId(req.params.id),
                'review._id': ObjectId(req.params.reviewid)
            },{
                '$set': {
                    'review.$.email': req.body.email ? req.body.email : review.email,
                    'review.$.comments': req.body.comments ? req.body.comments : review.comments,
                    'review.$.rating': req.body.rating ? req.body.rating : review.rating,
                    'review.$.date': req.body.date ? new Date(req.body.date) : new Date()
                }
            })

            res.status(200).json({
                'message': 'Updated succesfully'
            });
        } catch(err) {
            res.status(400).end('Any modifications are needed')
        }
    })

    // DELETE REVIEW
    app.delete('/earphone/:id/review/:reviewid',[checkIfAuthenticationJWT],async function(req,res){
        // VALIDATE PARAMS
        if(validator(validateParamsQuery,req.params,res)) return res;
        
        try {
            const result = await db.collection('earphone').updateOne({
                '_id': ObjectId(req.params.id)
            },{
                '$pull': {
                    'review': {
                        '_id': ObjectId(req.params.reviewid)
                    }
                }
            })

            // NO REVIEW ID TO DELETE
            if(result.modifiedCount === 0) throw err;

            res.status(200).json({
                'message': 'Deleted succesfully'
            });
        } catch(err) {
            res.status(400).end('Any modifications are needed')
        }
    })

    // SIGNUP USER
    app.post('/signup',async function(req,res){
        // VALIDATE BODY
        if(validator(validateSignup,req.body,res)) return res;

        const emailExist = await db.collection('user').findOne({
            'email': req.body.email
        })

        // CHECK EXISTING EMAIL
        if(emailExist) return res.status(422).json({
            'message': `${req.body.email} is already been registered`
        })

        // HASH THE PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await db.collection('user').insertOne({
            'username': req.body.username,
            'firstname': req.body.firstname,
            'lastname': req.body.lastname,
            'email': req.body.email,
            'password': hashedPassword,
            'comfirmPassword': hashedPassword
        })
        res.status(201).json({
            'message': `${req.body.email} is registered successfully`
        });
    })

    // LOGIN
    app.post('/login',async function(req,res){
        // VALIDATE BODY
        if(validator(validateLogin,req.body,res)) return res;

        const user = await db.collection('user').findOne({
            'email': req.body.email
        })

        // EMAIL NOT VALID
        if(!user) return res.status(422).json({
            'message': 'Invalid email or password'
        });

        // COMPARE HASHING PASSWORD
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) return res.status(422).json({
            'message': 'Invalid email or password'
        });

        // DISTRIBUTE TOKEN
        if(user) {
            const token = jwt.sign({
                'username': req.body.username,
                'firstname': req.body.firstname,
                'lastname': req.body.lastname
            },process.env.TOKEN_SECRET,{
                'expiresIn': '1h'
            })
            res.json({
                'User ID': user._id,
                'Access Token': token
            })
        } else {
            res.sendStatus(401)
        }
    })

    // UPDATE USER
    app.put('/user/:id',[checkIfAuthenticationJWT],async function(req,res){
        // VALIDATE BODY
        if(validator(validateUserUpdate,req.body,res)) return res;

        try {
            const user = await db.collection('user').findOne({
                '_id': ObjectId(req.params.id)
            })

            // NO USER ID FOUND
            if(!user) throw err;

            await db.collection('user').updateOne({
                '_id': ObjectId(req.params.id)
            },{
                '$set': {
                    'username': req.body.username ? req.body.username : user.username,
                    'firstname': req.body.firstname ? req.body.firstname : user.firstname,
                    'lastname': req.body.lastname ? req.body.lastname : user.lastname
                }
            })
            res.status(200).json({
                'message': 'Updated succesfully'
            });
        } catch(err) {
            res.status(400).end('Any modifications are needed')
        }
    })

    // DELETE USER
    app.delete('/user/:id',[checkIfAuthenticationJWT],async function(req,res){
        // VALIDATE PARAMS
        if(validator(validateParamsQuery,req.params,res)) return res;
        
        try {
            let result = await db.collection('user').deleteOne({
                '_id': ObjectId(req.params.id)
            })
            
            // NO USER ID TO DELETE
            if(result.deletedCount === 0) throw err;

            res.status(200).json({
                'message': 'Deleted successfully'
            });
        } catch(err) {
            res.status(400).end('Any modifications are needed')
        }
    })

    // THE 404 ROUTE
    app.all('*',function(req,res) {
        res.status(404).end('Server could not find what was requested');
    });
}
main();

app.listen(process.env.PORT, function () {
    console.log('Server started')
})