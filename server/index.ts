import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app: express.Application = express()
const server: http.Server = http.createServer(app)
const io: Server = new Server(server)

app.get('/', (_req, res) => {
//   res.send('<h1>Hello world</h1>')
  res.sendFile(__dirname + '/index.html')
})

const connectMsg: string = 'a user connected'

io.on('connection', (socket) => {
    console.log('a user connected')
    io.emit('connection', 'a user connected')    
    
    socket.on('disconnect', () => {        
        if (socket.disconnect(true)) {            
            io.emit('disconnection', 'user disconnected')
        }
    })
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
        // console.log('message: ' + msg)    
    })
    // socket.broadcast.emit('hi')
})

// io.emit(
//     'some event', 
//     { 
//         someProperty: 'some value',
//         otherProperty: 'other value' 
//     }
// ); // This will emit the event to all connected sockets

server.listen(3000, () => {
  console.log('listening on *:3000')
})