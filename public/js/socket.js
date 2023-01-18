let socket = io();
let position = {};
let id = "";
let gameData = [];
let player;
let moveFactor = 0.1;
let sceneEl = document.querySelector('a-scene');
let positionDomElement = document.querySelector('#position');

socket.on('init', (data) => {
    document.getElementById('user-id').innerHTML = data.id;  
    console.log('Data:');
    console.log(data);
    //create player
    player = document.createElement('a-entity');
    player.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.5
    });
    player.setAttribute('material', {
        shader: 'phong',
        reflectivity: 0.9,
        shininess: 30,
        color: '#0000ff'
    });
    player.setAttribute('shadow', {
        cast: true
    });
    position = { x: 0, y: 1, z: -2 };
    player.setAttribute('position', position);
    player.setAttribute('id', data.id);
    player.setAttribute('player', 'true');
    sceneEl.appendChild(player);
    id = data.id;
    gameData = data.gameData;
    update();
    positionDomElement.innerHTML = "Position: " + position.x + ", " + position.y + ", " + position.z;
});

socket.on('update', data => {
    gameData = data;
    update();
});

function update() {
    console.log('update');
    //add players that do not exist yet
    add();
    //remove players that do not exist anymore
    remove();
    //update players position
    gameData.map(player => {
        if (player.id != id) {
            let otherPlayer = document.querySelector("#" + player.id);
            otherPlayer.setAttribute('position', { x: player.x, y: player.y, z: player.z });
        }
    });
}

function add() {
    console.log("add");
    console.log(gameData);
    for (let player of gameData) {
        if (player.id != id) {
            if (document.querySelector("#" + player.id) == null) {
                let otherPlayer = document.createElement('a-entity');
                otherPlayer.setAttribute('geometry', {
                    primitive: 'sphere',
                    radius: 0.5
                });
                otherPlayer.setAttribute('shadow', {
                    cast: true
                });
                otherPlayer.setAttribute('material', {
                    shader: 'phong',
                    reflectivity: 0.9,
                    shininess: 30,
                    color: '#ff0000'
                });
                otherPlayer.setAttribute('position', { x: player.x, y: player.y, z: player.z });
                otherPlayer.setAttribute('id', player.id);
                otherPlayer.setAttribute('player', 'true');
                sceneEl.appendChild(otherPlayer);
            }
        }
    }
}

function remove() {
    let players = document.querySelectorAll('a-entity[player]');
    for (let player of players) {
        let found = false;
        if (player.id != id) {
            for (item of gameData) {
                if (item.id == player.id) {
                    found = true;
                }
            }
        }
        else {
            found = true;
        }
        if (found == false) {
            player.remove();
        }
    }
}

function move(direction) {
    //update player position
    position.x = Math.round((position.x + direction[0] * moveFactor) * 100) / 100;
    position.y = position.y;
    position.z = Math.round((position.z + direction[1] * moveFactor) * 100) / 100;
    player.setAttribute('position', position);
    //send new position to server
    socket.emit('move', position);
    positionDomElement.innerHTML = "Position: " + position.x + ", " + position.y + ", " + position.z;
}