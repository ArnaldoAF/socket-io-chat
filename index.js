import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

var onlineList = []
var typingList = []

io.on('connection', (socket) => {
    let USER_ID = null
    console.log('a user connected ✨');

    socket.on('user connected', (userID) => {
        USER_ID = userID
        onlineList.push(USER_ID)
        io.emit('atualizar lista online', onlineList)

    })

    socket.on('chat message from front', (msg) => {
        const {user, value} = msg
        const finalMessage = `👤 ${user}: ${value}`
        
        console.log(finalMessage);
        io.emit('chat message from back', msg);

      });
    
    socket.on('disconnect', () => {
        const finalMessage = ` ${USER_ID} DESCONECTOU! ❌`
        onlineList = onlineList.filter(id => id != USER_ID)
        console.log(`finalMessage`);
        const obj={
            user: USER_ID,
            value: finalMessage
        }
        io.emit('chat message from back', obj);
        io.emit('atualizar lista online', onlineList)

    });

    // socket.onAny((eventName, ...args) => {// 'hello'
    //     console.log(onlineList); // [ 1, '2', { 3: '4', 5: ArrayBuffer (1) [ 6 ] } ]
    //     io.emit('atualizar lista online', onlineList)
    //   });
});


server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
}); 