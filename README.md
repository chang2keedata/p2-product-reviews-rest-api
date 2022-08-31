# TGCProject2 - Earphone REST API

## Context and Goals
This is a restful API designed for a project on earphone. This API was created using Nodejs, Expressjs, MongoDB, and hosted on Heroku.

## Sample Document
Earphone document
```
{
    "brandModel": <string>
    "type": <string>
    "earbuds": <boolean>
    "bluetooth": <float>
    "price": <integer>
    "stock": <array of objects> i.e [{"store": <string>, "qty": <integer>}]
    "color": <array>
    "hours": <object> i.e {"music": <integer>, "cableCharging": <integer>, "boxCharging": <integer>}
    "dustWaterproof": <boolean>
    "connectors": <string>
    "review": <array of objects> i.e [{"email": <string>, "comments": <string>, "rating": <integer>}]
}
```
User document
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

## API endpoints
| Guideline ||
 --- | --- 
**Title** | A short phrase describing what the API does
**Method** | Whether it is GET, POST, PATCH, PUT or DELETE
**Endpoint Path** | The endpoint URL with URL with the possible parameters in <>
**Body** | Expected JSON object for the body for POST, PATCH and PUT requests
**Parameters** | Description of the parameters in the body and the URL
**Expected Response** | Expected JSON object for the response

|||
 --- | --- 
**Title** | Login
**Method** | POST
**Endpoint Path** | /login
**Body** | `{ "email": "<email>", "password": "<password>" }`
**Parameters** | N/A
**Expected Response** | `{ "message": "Logged in", "accessToken": "<JWT token>" }`

|||
 --- | --- 
**Title** | Retrieve all earphones with default pagination
**Method** | GET
**Endpoint Path** | /earphone
**Body** | N/A
**Parameters** | N/A
**Expected Response** | `{ "page": 1, "limit": 2, "result": [{...},{...}]}`

|||
 --- | --- 
**Title** | Retrieve earphone with pagination
**Method** | GET
**Endpoint Path** | /earphone?`parameter`
**Body** | N/A
**Parameters** | page=`integer`, limit=`integer` or both by adding `&` in between
**Expected Response** | `{ "page": 1, "limit": 2, "result": [{...},{...}, {...}]}`

|||
 --- | --- 
**Title** | Retrieve result with criteria
**Method** | GET
**Endpoint Path** | /earphone?`parameter`
**Body** | N/A
**Parameters** |  type=`string`, hours=`integer`, store=`string`, color=`string`, min_price=`integer/float`, max_price=`integer/float`
|| Inverse: otherColor=`string`, rating=`integer`
**Expected Response** | `{ "page": 1, "limit": 2, "result": [{...},{...}]}`

|||
 --- | --- 
**Title** | Create new earphone post
**Method** | POST
**Endpoint Path** | /add
**Body** | earphone document **without review**
**Parameters** | N/A
**Expected Response** | `{ "message": "Created successfully" }`

|||
 --- | --- 
**Title** | Update an earphone post
**Method** | PUT
**Endpoint Path** | /earphone/`:id`
**Body** | earphone document **without review**
**Parameters** | :id - _id of earphone object in document
**Expected Response** | `{ "message": "Updated successfully" }`

|||
 --- | --- 
**Title** | Delete an earphone post
**Method** | Delete
**Endpoint Path** | /earphone/`:id`
**Body** | N/A
**Parameters** | :id - _id of earphone object in document
**Expected Response** | `{ "message": "Deleted successfully" }`