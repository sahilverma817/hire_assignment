const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { User, Post } = require('./models/schema');
const app = express();
const port = process.env.PORT || 3000;

// Load environment variables from the .env file
dotenv.config({ path: './config.env' });


// Connect to the MongoDB database
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to the MongoDB database');
});


// Middleware to parse the request body
app.use(express.json());





app.post('/user', async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




// Endpoint for retrieving user info
app.get('/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


//Retrieve all the posts in the database
app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


//Endpoint for creating a new post
app.post('/post', async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const post = new Post({
            userId: user._id,
            data: req.body.data
        });
        await post.save();

        user.numPosts = user.numPosts + 1;
        await user.save();

        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});




function sendMail(email, name, data) {
    console.log('Sending email to ' + email);
    console.log('Hi ' + name + ', your post "' + data + '" has received a lot of likes!');
}


app.post('/like', async (req, res) => {
    try {
        const { postId, userId } = req.body;

        const post = await Post.findOne({ postId: postId })
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user has already liked the post
        if (post.likes.some((like) => like.userId.toString() === userId)) {
            return res.status(400).json({ message: 'User has already liked this post' });
        }

        post.likes.push({ userId: user._id });
        const numLikes = post.likes.length;
        post.numLikes = numLikes;
        await post.save();

        var totalLikes = user.totalLikes;
        var avgLikes = (totalLikes * 1.0) / user.numPosts;
        if (numLikes > avgLikes) {
            const toBeNotified = await User.findById(post.userId);
            sendMail(toBeNotified.email, toBeNotified.name, post.data);
        }
        
        user.totalLikes = totalLikes + 1;
        await user.save();

        res.status(201).json({ message: 'Post liked' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


//Return top 10 most famous posts
app.get('/famous', async (req, res) => {
    try {
        const posts = await Post.find().sort({ numLikes: -1 }).limit(10);
        res.json(posts);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
}
);