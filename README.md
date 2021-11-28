# Sayna-TestBack-NodeJS

## Description

A NodeJS API that manages a user Authentication. 

## HOST
https://nodejs-auth-api-sayna-test.herokuapp.com/

## Installation

```bash
$ npm install
```

## Running the app

```bash
$ npm start

```

## All Endpoints

### The root [GET] [/]

+ Response 200 (rendering a greeting html page)

  Hello Sayna!!

### Register [POST] [/api/register]

Use this in order to get registered

+ Request (application/json)

    ```json
        {
            "firstname" : "John",
            "lastname" : "Doe",
            "birthday" : "1998-12-15",
            "gender" : "M",
            "email" : "john@doe.com",
            "password" : "12345678"
        }
    ```

+ Response 200 (application/json)

    + Body

    ```json
        {
    "error": false,
    "message": "L'utilisateur a bien été créé avec succès",
    "tokens": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6I...",
        "createdAt": "2021-11-28T14:26:05.140Z"
    }

   ```

### Login [POST] [/api/login]

Use this for login

+ Request (application/json)

    ```json
        {
            "email": "john@doe.com",
            "password": "12345678"
        }
    ```

+ Response 200 (application/json)

    + Body

    ```json
        {
            "error": false,
            "message": "L'utilisateur a été authentifié avec succès",
            "tokens": {
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXV...",
                "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
                "createdAt": "2021-11-28T13:15:20.806Z"
            }
        }
   ```

### Get user [GET] [/api/user] [Need auth-token in header]

Use this and get your user profile information

+ Request (application/json)
    
    Don't forget to add auth-token in your header.
    The app will know your user_id by uncrypt the token.

+ Response 200 (application/json)

    + Body

    ```json
        {
            "error": false,
            "user": {
                "firstname": "John",
                "lastname": "Doe",
                "birthday": "1998-12-15T00:00:00.000Z",
                "gender": "M",
                "email": "john@doe.com",
                "tokens": {
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWEzOTE3Yzg1NDE5MTljZGE4OGFlNjMiLCJpYXQiOjE2MzgxMDk1NjUsImV4cCI6MTYzODExMzE2NX0.ZPTop_u13_DsNxVlzf0p0k_l4mcnpj41ka8PqoABnw0",
                    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWEzOTE3Yzg1NDE5MTljZGE4OGFlNjMiLCJpYXQiOjE2MzgxMDk1NjUsImV4cCI6MTY0MDcwMTU2NX0.Ey2gfIvDMWofSUZY8a7f37omOxQYXnxV5JlGKLPyR7w",
                    "createdAt": "2021-11-28T14:26:05.140Z",
                    "_id": "61a3917c8541919cda88ae64"
                },
                "createdAt": "2021-11-28T14:26:04.835Z"
            }
        }
   ```

### Update user [PUT] [/api/user] [Need auth-token in header]

Use this to edit some field in your user profile

+ Request (application/json)
    
    Don't forget to add auth-token in your header.
    The app will know your user_id by uncrypt the token.
    
    Only four field can be updated : firstname, lastname, birthday, gender.
    Just write your change, you can forget others. Like in the next request, only "firstname" and "gender" will be updated.

    ```json
        {
            "firstname": "Jane",
            "gender": "F"
        }
    ```    

+ Response 200 (application/json)

    + Body

    ```json
        {
            "error": false,
            "message": "L'utilisateur a été modifié avec succès"
        }
        ```

### Change user password [PUT] [/api/user/password] [Need auth-token in header]

User this and change your password

+ Request (application/json)
    
    Don't forget to add auth-token in your header.
    The app will know your user_id by uncrypt the token.
    
    ```json
        {
            "currentPassword": "azerty",
            "newPassword": "123456"
        }
    ```    

+ Response 200 (application/json)

    + Body 

    ```json
        {
            "error": false,
            "message": "Mot de passe changé avec succès"
        }
        ```

### Get users [GET] [/api/users] [Need auth-token in header]

    + Request (application/json)
    
        Don't forget to add auth-token in your header.

    + Response 200 (application/json)

        + Body

        ```json
            {
                "error": false,
                "users": [
                    {
                        "firstname": "Jane",
                        "lastname": "Doe",
                        "birthday": "1998-12-15T00:00:00.000Z",
                        "gender": "F",
                        "email": "jane@doe.com",
                        "tokens": {
                            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQ...",
                            "createdAt": "2021-11-28T13:15:20.806Z",
                            "_id": "61a380e8fb6d2fba278e6a9b"
                        }
                    },
                    {
                        "firstname": "Johnny",
                        "lastname": "Doe",
                        "birthday": "1998-12-15T00:00:00.000Z",
                        "gender": "M",
                        "email": "john@doe.com",
                        "tokens": {
                            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX...",
                            "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...",
                            "createdAt": "2021-11-28T14:26:05.140Z",
                            "_id": "61a3917c8541919cda88ae64"
                        }
                    }
                ]
            }
        ```

### Logout [DELETE] [/api/logout] [Need auth-token in header]

    + Request (application/json)

        Don't forget to add auth-token in your header.
        The app will know your user_id by uncrypt the token.

    + Response 200 (application/json)

        + Body

        ```json
        {
            "error": false,
            "message": "L'utilisateur a été déconnecté avec succès"
        }
        ``` 


- Author - [Razafiarison Tafita](https://www.linkedin.com/in/tafita-raza)
