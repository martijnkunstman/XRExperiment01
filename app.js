const express = require('express')
const app = express()
const port = process.env.PORT || 8080
app.use(express.static('public'))
const server = app.listen(port, () => {console.log(`Example app listening on port ${port}`)})
const socket = require('socket.io')
const io = socket(server)
io.on('connection', newConnection)
function newConnection(socket) {
    console.log('Got connected!')

    socket.emit('init', 'App init!')

    socket.on('disconnect', () => {
        console.log('Got disconnect!')
    })

    socket.on('click', (counter) => {
        console.log('Counter: ' + counter)
    })
}
