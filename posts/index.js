const express = require('express')
const {randomBytes} = require('crypto')
const bodyParser = require('body-parser')
const cors = require('cors')
const { default: axios } = require('axios')

let app = express()
app.use(cors())
app.use(bodyParser.json())
let posts = {}

app.get('/posts', (req,res) => {
    res.send(posts)
})

app.post('/posts', async (req,res) => {
    const id = randomBytes(4).toString('hex');
    const title = req.body.title
    posts[id] = {id, title}
    console.log(req.body.title)

   try {
    console.log(req.body.title)

    await axios.post('http://localhost:4005/events', {
        type: 'PostCreated',
        data: {title, id}
    })
   }catch(e) {
    console.log(e)
   }
    res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {

    console.log('event recieved', req.body.type)

    res.send({})
})
app.listen('4000', () => {
    console.log('listening on http://localhost:4000')
})