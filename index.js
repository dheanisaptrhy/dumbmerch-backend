require('dotenv').config()
const express = require('express')
const cors = require('cors')

const http = require('http')
const { Server } = require('socket.io')

const router = require('./src/routes')
const app = express()

// socket io
const server = http.createServer(app);
//create server dari express
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
        //mengacu ke bagian client
    }
})
// parameter server, parameter cors (untuk komunikasi ke client)

// import dari socket io
require('./src/socket')(io)

const port = process.env.PORT || 3500

app.use(express.json())
app.use(cors());

app.use('/api/v1/', router)
app.use('/uploads', express.static('uploads'))
server.listen(port, () => console.log(`Listen to port ${port}`))