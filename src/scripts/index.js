const gridSize = 15;
const grid = document.querySelector('.grid');
const squares = document.getElementsByClassName('square');
const appleCountDisplay = document.getElementById('apple-count');
const scoreDisplay = document.getElementById('score');
const overlay = document.querySelector('.overlay');
const playerName = document.getElementById('player-name');
const leaderboard = document.querySelector('.table');
let players = [];
let currentSnake = [0,1,2];
let appleIndex = 6;
let speed = 0.8;
let direction, intervalTime, timerId, appleCount, score;


function createGrid() {
    for (let i=0; i < gridSize*gridSize; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
        square.classList.add('square');
    }
}
createGrid();


function setupGame() {
    document.removeEventListener('keydown', saveScore);
    overlay.style.display = 'none';
    currentSnake.forEach(i => squares[i].classList.remove('snake'));
    squares[appleIndex].innerHTML = '';
    clearInterval(timerId);

    currentSnake = [0,1,2];
    direction = 1;
    intervalTime = 1000;
    appleCount = 0;
    score = 0;
    appleCountDisplay.textContent = appleCount;
    scoreDisplay.textContent = score;

    currentSnake.forEach(i => squares[i].classList.add('snake'));
    generateApple();
    document.addEventListener('keydown', startGame);
}
setupGame();


function generateApple() {
    do {
        appleIndex = Math.floor(Math.random() * squares.length);
    } while (squares[appleIndex].classList.contains('snake'));
    squares[appleIndex].innerHTML = '<img src="./images/apple.svg" alt="apple-icon" class="apple">';
}


function startGame(event) {
    if (event.key === 'Enter') {
        document.removeEventListener('keydown', startGame);
        document.addEventListener('keydown', controlGame);
        timerId = setInterval(move, intervalTime);
    }
}


function move() {
    let snakeHead = currentSnake[currentSnake.length - 1];
    let newSnakeHead, snakeTail;

    if (
        (snakeHead + gridSize >= gridSize*gridSize && direction === gridSize ) ||
        (snakeHead % gridSize === gridSize - 1 && direction === 1) ||
        (snakeHead % gridSize === 0 && direction === -1) ||
        (snakeHead - gridSize < 0 && direction === -gridSize) ||
        squares[snakeHead + direction].classList.contains('snake')
    ) {
        playerName.value = '';
        overlay.style.display = 'block';
        playerName.focus();
        document.addEventListener('keydown', saveScore);
        clearInterval(timerId);
        return;
    }

    currentSnake.push(snakeHead + direction);
    newSnakeHead = currentSnake[currentSnake.length - 1];
    snakeTail = currentSnake.shift();
    squares[newSnakeHead].classList.add('snake');
    squares[snakeTail].classList.remove('snake');

    if (squares[newSnakeHead].firstElementChild) {
        squares[newSnakeHead].innerHTML = '';
        currentSnake.unshift(snakeTail);
        squares[snakeTail].classList.add('snake');
        appleCount++;
        score = appleCount * 5;
        appleCountDisplay.textContent = appleCount;
        scoreDisplay.textContent = score;

        generateApple();
        clearInterval(timerId);

        if (intervalTime > 400) intervalTime = intervalTime * speed;

        timerId = setInterval(move, intervalTime);
    }
}

function controlGame(event) {
    switch (event.key) {
        case 'ArrowRight':
            direction = 1;
            break;
        case 'ArrowLeft':
            direction = -1;
            break;
        case 'ArrowDown':
            direction = gridSize;
            break;
        case 'ArrowUp':
            direction = -gridSize;
    }
}

function saveScore(event) {
    if (event.key === 'Enter') {
    
        players = JSON.parse(localStorage.getItem('players'));
        players.push({
            name: playerName.value ? playerName.value : 'Anonymous',
            score: score
        })
        players.sort((a,b) => {
            if (a.score >= b.score) return 0
            if (a.score < b.score) return 1
        })
        players.splice(10,1)
        updateLeaderboard();
        setupGame();
        localStorage.setItem(JSON.stringify(players));
    }
}

function updateLeaderboard() {
    let html = '';
    players.forEach((player,index) => {
        html += `
            <p>${index+1}</p>
            <p>${player.name}</p>
            <p class="score">${player.score} pts</p>
        `
    })
    leaderboard.innerHTML = html;
}