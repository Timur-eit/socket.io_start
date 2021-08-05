import express from 'express'
import http from 'http'
import { Server, Socket } from 'socket.io'
import path from 'path'

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const port: number = 3000

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/index.html')
})

server.listen(port, () => {
    console.log(`Server listening at port ${port}`)
  })

// app.use(express.static(path.join(__dirname, 'public')))

const connectMsg: string = 'a user connected'

interface ExtendedSocket extends Socket {
    username: string,
    message: string
}

let numUsers: number = 0

io.on('connection', (socket) => {   
    const mySocket = <ExtendedSocket>socket
    let addedUser: boolean = false

    mySocket.on('chat message', (data) => {
        // io.emit('chat message', data)
        
        io.emit('chat message', {
            username: mySocket.username,
            message: data
        })
        
    })
    
    mySocket.on('add user', (username: string) => {
        if (addedUser) return;

        mySocket.username = username;
        ++numUsers
        addedUser = true
        mySocket.emit('login', {
            numUsers: numUsers
        })

        io.emit('user joined', {
            username: mySocket.username,
            numUsers: numUsers
        })
    })

    // io.emit('connection', 'a user connected')

    mySocket.on('disconnect', () => {
        if (mySocket.disconnect(true)) {
            io.emit('disconnection', 'user disconnected')
        }
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

