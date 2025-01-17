const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const app = express();

app.use(cors())
app.use(bodyParser.json())

app.post('/events', async (req, res) => {
    console.log('event recieved', req.body.type)
    const { type, data } = req.body
    if(type ==='CommentCreated'){
        const status = data.content.includes('orange') ? 'rejected' : 'approved'
        try {
            await axios.post('http://localhost:4005/events', {
                type: 'CommentModerated',
                data:{
                    id: data.id,
                    content: data.content,
                    postId: data.postId,
                    status
                }
            }) 
        } catch (error) {
            console.log(error)
        }
    }
    res.send({})
})

app.listen(4003, () => {
    console.log('listening on http://localhost:4003 port' )
})