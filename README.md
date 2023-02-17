Sample Social Media Backend
This is a simple Node.js and MongoDB project that demonstrates the use of Mongoose to define and interact with MongoDB models.

Installation:
Clone the repository
Run npm install to install the dependencies


Usage:
To use the project, follow these steps:
Start the Node.js server by running npm start
Use a REST client, such as Postman, to send HTTP requests to the server


Models:
User
The User model represents a user in the system. It has the following properties:

name (string, required) - The user's name
email (string, required, unique) - The user's email address
password (string, required) - The user's password
totalLikes (number, default 3) - The total number of likes the user has given
numPosts (number, default 0) - The total number of posts the user has created

Post
The Post model represents a post in the system. It has the following properties:

postId (ObjectId, unique, default generated) - The post's ID
userId (ObjectId, required, ref: 'User') - The ID of the user who created the post
data (string, required) - The content of the post
likes (array of objects) - An array of objects representing the users who have liked the post, and the timestamps when they liked it
userId (ObjectId, required, ref: 'User') - The ID of the user who liked the post
timestamp (Date, default: Date.now) - The timestamp when the user liked the post
numLikes (number, default 0) - The total number of likes the post has received


Dependencies:

express
mongoose
body-parser


Endpoints:

Creating a new user:
Endpoint: POST /user

Request body: {
    name: string, // required
    email: string, // required, must be unique
    password: string // required
}

Response: {
    _id: ObjectId,
    name: string,
    email: string,
    password: string,
    totalLikes: number,
    numPosts: number
}


Retrieving user info:
Endpoint: GET /user/:userId

Response: {
    _id: ObjectId,
    name: string,
    email: string,
    password: string,
    totalLikes: number,
    numPosts: number
}


Retrieving all posts:
Endpoint: GET /post

Response: [{
    _id: ObjectId,
    userId: ObjectId,
    data: string,
    likes: [{
        userId: ObjectId,
        timestamp: Date
    }],
    numLikes: number
}]


Creating a new post:
Endpoint: POST /post

Request body: {
    userId: ObjectId, // required
    data: string // required
}

Response: {
    _id: ObjectId,
    userId: ObjectId,
    data: string,
    likes: [],
    numLikes: number
}


Liking a post:
Endpoint: POST /like

Request body: {
    postId: ObjectId, // required
    userId: ObjectId // required
}

Response: {
    message: string
}


Retrieving the top 10 most famous posts:
Endpoint: GET /famous

Response: [{
    _id: ObjectId,
    userId: ObjectId,
    data: string,
    likes: [{
        userId: ObjectId,
        timestamp: Date
    }],
    numLikes: number
}]
