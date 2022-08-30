# TGCProject2 - Earphone REST API

## Context and Goals
This is a restful API designed for a project on earphone. This API was created using Nodejs, Expressjs, MongoDB, and hosted on Heroku.

## Demo
![alt text]()

A live website of the application can be found [here]().

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
    "review": [{"email": <string>, "comments": <string>, "rating": <integer>}]
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