const express = require('express')
const app = express()
const port = process.env.PORT || 8080
app.use(express.static('public'))
const server = app.listen(port, () => { console.log(`Example app listening on port ${port}`) })
const socket = require('socket.io')
const io = socket(server)
io.on('connection', newConnection)
let gameData = []; //array of objects that hold x and y coordinates of the player

function newConnection(socket) {
    console.log('Got a new connection with id: ' + "id"+socket.id);
    gameData.push({ x: 0, y: 1, z: -2, id: "id"+socket.id })
    socket.emit('init', { id: "id"+socket.id, gameData: gameData });
    socket.broadcast.emit('update', gameData);
    socket.on('disconnect', () => {
        console.log('Disconnect connection with id: ' + "id"+socket.id);
        gameData = removeObjectWithId(gameData, "id"+socket.id);
        socket.broadcast.emit('update', gameData);
        console.log(gameData);
    })
    socket.on('move', (data) => {
        console.log('Update by connection with id: ' + "id"+socket.id);
        gameData.map(player => { if (player.id === "id"+socket.id) { player.x = data.x; player.y = data.y; player.z = data.z; } })
        socket.broadcast.emit('update', gameData);
        console.log(gameData);
    })
}

function removeObjectWithId(arr, id) {
    return arr.filter((obj) => obj.id !== id);
}
