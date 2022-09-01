# TGCProject2 - Earphone REST API

## Intro
This is a restful API designed for a project on earphone. This API was created using Nodejs, Expressjs, MongoDB, and hosted on Heroku ([Link Here](https://tgc-earphone-review-rest-api.herokuapp.com "https://tgc-earphone-review-rest-api.herokuapp.com")).

User are able to search, read, edit, delete the earphone post with login authentication (email and password). Although our server is built encryption system to hash all the users' password, please don't use any online banking related password. 

## Context
Bluetooth earphones are growing popular nowadays. Most people own at least one as their daily commuter companion to embrace themselves with their favorite music/drama/video/calls/etc or just to give themselves a peaceful noise reduced environment.

## Goal
Thus our goal is to gather information of bluetooth earphone about any best budget friendly/functional purposed/branded or not as long as long it works. Any features include prices, color, connector types, battery life, water and dustproof etc.

## Tech used
**Backend**
- `Node.js` a JavaScript runtime built on Chrome's V8 JavaScript engine
- `Express.js` a web application framework for Node.js
- `MongoDB` a NoSQL database system
- `CORS` a mechanism allows server to indicate any origins (domain, scheme, or port) other than its own
- `joi` a npm package as data validator for JavaScript
- `dotenv` a npm package to store configuration in the environment separate from code
- `jsonwebtoken/JWT` a npm package to share security information between two parties — a client and a server
- `bcrypt.js` a npm package enables storing passwords as hashed passwords instead of plaintext

**Platform and Software**
- `Github` an Internet hosting service for software development and version control using Git
- `Gitpod` a platform for remote software development
- `Heroku` a cloud platform helps developers to build, run, and operate applications entirely
- `Advanced REST Client` a API testing tool

## Sample Document
Earphone collection template
```
{
    "brandModel": <string>
    "type": <string>
    "earbuds": <boolean> i.e 'yes', 'no', 'y', 'n'
    "bluetooth": <float>
    "price": <integer>
    "stock": <array of objects> i.e [{"store": <string>, "qty": <integer>}]
    "color": <array>
    "hours": <object> i.e {"music": <integer>, "cableCharging": <integer>, "boxCharging": <integer>}
    "dustWaterproof": <boolean> i.e 'yes', 'no', 'y', 'n'
    "connectors": <string>
    "review": <array of objects> i.e [{"email": <string>, "comments": <string>, "rating": <integer>}]
}
```

User collection template
```
{
    "username": <string>,
    "firstname": <string>,
    "lastname": <string>,
    "email": <string>,
    "password": <string>,
    "comfirmPassword": <string>
}
```

## Guidelines of API Endpoint
|||
 --- | --- 
**Title** | A short phrase describing what the API does
**Method** | Whether it is GET, POST, PATCH, PUT or DELETE
**Endpoint Path** | The endpoint URL with URL with the possible parameters in <>
**Body** | Expected JSON object for the body for POST, PATCH and PUT requests
**Parameters** | Description of the parameters in the body and the URL
**Expected Response** | Expected JSON object for the response

## Product Routes
|||
 --- | --- 
**Title** | Retrieve all products
**Method** | GET
**Endpoint Path** | /earphone
**Body** | N/A
**Parameters** | N/A
**Expected Response** | `{ "page": 1, "limit": 2, "result": [{...},{...}]}`
|||
**Title** | Retrieve result with pagination
**Method** | GET
**Endpoint Path** | /earphone?`parameter`
**Body** | N/A
**Parameters** | page=`integer`, limit=`integer` or both by adding `&` in between
**Expected Response** | `{ "page": 1, "limit": 2, "result": [{...},{...}, {...}]}`
|||
**Title** | Retrieve result with criteria
**Method** | GET
**Endpoint Path** | /earphone?`parameter`
**Body** | N/A
**Parameters** |  type=`string`, hours=`integer`, store=`string`, color=`string`, min_price=`integer/float`, max_price=`integer/float`
|| Inverse: otherColor=`string`, rating=`integer`
**Expected Response** | `{ "page": 1, "limit": 2, "result": [{...},{...}]}`
|||
**Title** | Create a new product
**Method** | POST
**Endpoint Path** | /add
**Body** | earphone template **without review**
**Parameters** | N/A
**Expected Response** | `{ "message": "Created successfully" }`
|||
**Title** | Update a product
**Method** | PUT
**Endpoint Path** | /earphone/`:id`
**Body** | earphone template **without review**
**Parameters** | :id - _id of earphone object in document
**Expected Response** | `{ "message": "Updated successfully" }`
|||
**Title** | Delete a product
**Method** | Delete
**Endpoint Path** | /earphone/`:id`
**Body** | N/A
**Parameters** | :id - _id of earphone object in document
**Expected Response** | `{ "message": "Deleted successfully" }`

## Review Routes
|||
 --- | --- 
**Title** | Create a review of product
**Method** | POST
**Endpoint Path** | /earphone/`:id`/review
**Body** | **review only** in earphone template 
**Parameters** | :id - _id of earphone object in document
**Expected Response** | `{ "message": "Created successfully" }`
||| 
**Title** | Retrive a review of product
**Method** | GET
**Endpoint Path** | /earphone/`:id`/review
**Body** | N/A 
**Parameters** | :id - _id of earphone object in document
**Expected Response** | `{ "_id": <string>, "brandModel": <string>, "review": <array of objects> }`
||| 
**Title** | Retrive all reviews of user
**Method** | GET
**Endpoint Path** | /user/review?
**Body** | N/A 
**Parameters** | N/A
**Expected Response** | `[{ "_id": <string>, "userAllReviews": <array of objects> i.e "brandModel": <string>, "review": <array of objects> }]`
||| 
**Title** | Update a review of product
**Method** | PUT 
**Endpoint Path** | /earphone/`:id`/review/`:reviewid`
**Body** | **review without email** in earphone template
**Parameters** | :id - _id of earphone object in document, :reviewid - _id of earphone project in document
**Expected Response** | `{ "message": "Updated successfully" }`
||| 
**Title** | Delete a review of product
**Method** | DELETE 
**Endpoint Path** | /earphone/`:id`/review/`:reviewid`
**Body** | N/A
**Parameters** | :id - _id of earphone object in document, :reviewid - _id of earphone project in document
**Expected Response** | `{ "message": "Deleted successfully" }`

## User Routes
|||
 --- | --- 
**Title** | Sign up
**Method** | POST
**Endpoint Path** | /signup
**Body** | user template
**Parameters** | N/A
**Expected Response** | `{ "message": "<email> is registred successfully" }`
|||
**Title** | Login
**Method** | POST
**Endpoint Path** | /login
**Body** | `{ "email": "<email>", "password": "<password>" }`
**Parameters** | N/A
**Expected Response** | `{ "message": "Logged in", "accessToken": "<JWT token>" }`
|||
**Title** | Update a user
**Method** | PUT
**Endpoint Path** | /user/`:id`
**Body** | user template **without email, password, and comfirmPassword**
**Parameters** | :id - _id of user object in document
**Expected Response** | `{ "message": "Updated successfully" }`
|||
**Title** | Delete a user
**Method** | Delete
**Endpoint Path** | /user/`:id`
**Body** | N/A
**Parameters** | :id - _id of user object in document
**Expected Response** | `{ "message": "Deleted successfully" }`

## Other Route
|||
 --- | --- 
**Title** | Redirect not found pages
**Method** | ALL
**Endpoint Path** | N/A
**Body** | N/A
**Parameters** | N/A
**Expected Response** | `Server could not find what was requested`

## Test Cases
## Product
|||
 --- | --- 
**Method** | POST
**Endpoint Path** | /add
**Body & Expected Response** | <img src="images/addfail.png" width=60%><img src="images/add.png" width=30%>
|||
**Method** | GET
**Endpoint Path** | /earphone
**Body & Expected Response** | <img src="images/result.png" width=40%>
|||
**Method** | GET
**Endpoint Path** | /earphone?color=blue
**Body & Expected Response** | <img src="images/blue.png" width=40%>
|||
**Method** | GET
**Endpoint Path** | /earphone?page=1&limit=1
**Body & Expected Response** | <img src="images/page1&limit1.png" width=40%>
|||
**Method** | PUT
**Endpoint Path** | /earphone/630ef7f15ea1b97eebcbbe75
**Body & Expected Response** | !<img src="images/updateprice.png" width=40%>
|||
**Method** | DELETE
**Endpoint Path** | /earphone/630ef7f15ea1b97eebcbbe75
**Body & Expected Response** | <img src="images/delete.png" width=40%><img src="images/deleteidnotfound.png" width=58%>
|||
**Method** | ALL
**Endpoint Path** | /earphone/630ef7f15ea1b97eebcbbe7555/review
|| /earphone/630ef7f15ea1b97eebcbbe75=/review
**Body & Expected Response** | <img src="images/invalidid.png" width=50%><img src="images/invalidid2.png" width=50%>
|||
**Method** | GET
**Endpoint Path** | /earphone/6308e842fa01e789ba8742ca/review
**Body & Expected Response** | <img src="images/earphonereview.png" width=40%>
|||
**Method** | GET
**Endpoint Path** | /user/review?
**Body & Expected Response** | <img src="images/userreview.png" width=40%>
|||
**Method** | POST
**Endpoint Path** | /earphone/630f50922297a3ca1c561322/review
**Body & Expected Response** | <img src="images/addreviewfail.png" width=60%><img src="images/addreview.png" width=33%>
|||
**Method** | PUT
**Endpoint Path** | /earphone/6308e842fa01e789ba8742ca/review/6309c51829020664650c06ac
**Body & Expected Response** | <img src="images/updatereview.png" width=50%>
|||
**Method** | DELETE
**Endpoint Path** | earphone/6308e842fa01e789ba8742ca/review/6309c51829020664650c06ac
**Body & Expected Response** | <img src="images/deletereview.png" width=50%>
|||
**Method** | POST
**Endpoint Path** | /signup
**Body & Expected Response** | <img src="images/signupfail.png" width=50%> <img src="images/emailfail.png" width=50%><img src="images/emailsuccess.png" width=50%>
|||
**Method** | POST
**Endpoint Path** | /login
**Body & Expected Response** | <img src="images/loginfail.png" width=50%><img src="images/login.png" width=30%>
|||
**Method** | PUT
**Endpoint Path** | /user/630f4caaffb13891f245dd3c
**Body & Expected Response** | <img src="images/updateuserfail.png" width=55%><img src="images/updateuser.png" width=40%>