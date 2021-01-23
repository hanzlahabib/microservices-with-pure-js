const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const axios = require('axios')
const app = express();

app.use(cors())
app.use(bodyParser.json())
const posts = {}
app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {
    const {type, data} = req.body
    eventHandler(type, data);
    console.log('event recieved', type)
    res.send({})
})

app.listen(4002, async () => {
    console.log('listening on http://localhost:4002')
    const {data} = await axios.get('http://localhost:4005/events')
    for(let event of data){
        console.log('Processing event:', event.type)
        eventHandler(event.type, event.data)
    }
})

function eventHandler(type, data) {
    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, 'comments': [] };
    }
    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;
        let post = posts[postId];
        post.comments.push({ id, content, status });
    }
    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;
        const comment = posts[postId].comments.find(comment => comment.id === id);
        comment.status = status;
        comment.content = content;
    }
}
